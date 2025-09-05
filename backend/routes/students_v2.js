const express = require('express');
const { body, validationResult } = require('express-validator');
const database = require('../config/database');
const azureBlobService = require('../services/azureBlobService');
const { upload } = require('../middleware/upload');
const { authenticateToken, requireStudent, requireStudentOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get student profile
router.get('/profile', [authenticateToken, requireStudent], async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get user info
        const user = database.get(
            'SELECT id, email, first_name, last_name, phone, created_at FROM users WHERE id = ?',
            [userId]
        );
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Get student info
        const student = database.get(
            `SELECT s.*, COUNT(dsa.donor_id) as total_donors 
             FROM students s
             LEFT JOIN donor_student_assignments dsa ON s.id = dsa.student_id AND dsa.is_active = 1
             WHERE s.user_id = ?
             GROUP BY s.id`,
            [userId]
        );
        
        if (!student) {
            return res.status(404).json({ error: 'Student profile not found' });
        }
        
        // Get documents
        const documents = database.all(
            'SELECT * FROM student_documents WHERE student_id = ? ORDER BY uploaded_at DESC',
            [student.id]
        );
        
        const profile = {
            ...user,
            ...student,
            firstName: user.first_name,
            lastName: user.last_name,
            userType: 'student',
            profilePicture: student.profile_picture_url,
            documents: documents.map(doc => ({
                id: doc.id,
                documentTitle: doc.document_title,
                documentType: doc.document_type,
                fileName: doc.file_name,
                fileUrl: doc.file_url,
                uploadedAt: doc.uploaded_at,
                description: doc.description,
                amount: doc.amount
            }))
        };
        
        res.json(profile);
    } catch (error) {
        console.error('Error fetching student profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update student profile
router.put('/profile', [
    authenticateToken,
    requireStudent,
    body('firstName').optional().trim().isLength({ min: 1 }),
    body('lastName').optional().trim().isLength({ min: 1 }),
    body('phone').optional().trim(),
    body('dateOfBirth').optional().isISO8601(),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('address').optional().trim(),
    body('city').optional().trim(),
    body('country').optional().trim(),
    body('schoolName').optional().trim(),
    body('gradeLevel').optional().trim(),
    body('fieldOfStudy').optional().trim(),
    body('emergencyContactName').optional().trim(),
    body('emergencyContactPhone').optional().trim(),
    body('guardianName').optional().trim(),
    body('guardianPhone').optional().trim(),
    body('guardianEmail').optional().isEmail(),
    body('bio').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const userId = req.user.id;
        const {
            firstName,
            lastName,
            phone,
            dateOfBirth,
            gender,
            address,
            city,
            country,
            schoolName,
            gradeLevel,
            fieldOfStudy,
            emergencyContactName,
            emergencyContactPhone,
            guardianName,
            guardianPhone,
            guardianEmail,
            bio
        } = req.body;
        
        const transaction = database.transaction(() => {
            // Update users table
            if (firstName || lastName || phone) {
                const userUpdates = [];
                const userParams = [];
                
                if (firstName) {
                    userUpdates.push('first_name = ?');
                    userParams.push(firstName);
                }
                if (lastName) {
                    userUpdates.push('last_name = ?');
                    userParams.push(lastName);
                }
                if (phone) {
                    userUpdates.push('phone = ?');
                    userParams.push(phone);
                }
                
                userParams.push(userId);
                database.run(
                    `UPDATE users SET ${userUpdates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                    userParams
                );
            }
            
            // Update students table
            const studentUpdates = [];
            const studentParams = [];
            
            const studentFields = {
                date_of_birth: dateOfBirth,
                gender,
                address,
                city,
                country,
                school_name: schoolName,
                grade_level: gradeLevel,
                field_of_study: fieldOfStudy,
                emergency_contact_name: emergencyContactName,
                emergency_contact_phone: emergencyContactPhone,
                guardian_name: guardianName,
                guardian_phone: guardianPhone,
                guardian_email: guardianEmail,
                bio
            };
            
            Object.entries(studentFields).forEach(([key, value]) => {
                if (value !== undefined) {
                    studentUpdates.push(`${key} = ?`);
                    studentParams.push(value);
                }
            });
            
            if (studentUpdates.length > 0) {
                studentParams.push(userId);
                database.run(
                    `UPDATE students SET ${studentUpdates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
                    studentParams
                );
            }
        });
        
        transaction();
        
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating student profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Upload profile picture
router.post('/profile-picture', [
    authenticateToken,
    requireStudent,
    upload.single('profilePicture')
], async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const userId = req.user.id;
        
        // Get student info
        const student = database.get('SELECT * FROM students WHERE user_id = ?', [userId]);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        // Upload to Azure Blob Storage
        const uploadResult = await azureBlobService.uploadProfilePicture(
            req.file.buffer,
            req.file.originalname,
            userId
        );
        
        // Clean up old profile picture if exists
        if (student.profile_picture_url) {
            const oldBlobName = student.profile_picture_url.split('/').pop();
            if (oldBlobName) {
                await azureBlobService.cleanupOldProfilePicture(userId, uploadResult.blobName);
            }
        }
        
        // Update database
        database.run(
            'UPDATE students SET profile_picture_url = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
            [uploadResult.url, userId]
        );
        
        res.json({
            message: 'Profile picture uploaded successfully',
            profilePictureUrl: uploadResult.url
        });
        
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ error: 'Failed to upload profile picture' });
    }
});

// Upload document
router.post('/documents', [
    authenticateToken,
    requireStudent,
    upload.single('document'),
    body('documentType').isIn(['school_result', 'receipt', 'certificate', 'primary_certificate', 'secondary_certificate', 'university_certificate', 'other']),
    body('documentTitle').trim().isLength({ min: 1 }),
    body('description').optional().trim(),
    body('amount').optional().isDecimal() // For receipts
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const userId = req.user.id;
        const { documentType, documentTitle, description, amount } = req.body;
        
        // Get student info
        const student = database.get('SELECT * FROM students WHERE user_id = ?', [userId]);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        // Upload to Azure Blob Storage
        const uploadResult = await azureBlobService.uploadDocument(
            req.file.buffer,
            req.file.originalname,
            documentType,
            userId,
            student.id
        );
        
        // Save to database
        const result = database.run(
            `INSERT INTO student_documents 
             (student_id, document_type, document_title, file_name, file_size, mime_type, file_url, blob_name, description, amount)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                student.id,
                documentType,
                documentTitle,
                req.file.originalname,
                uploadResult.size,
                uploadResult.mimeType,
                uploadResult.url,
                uploadResult.blobName,
                description || null,
                documentType === 'receipt' ? amount : null
            ]
        );
        
        res.json({
            message: 'Document uploaded successfully',
            documentId: result.id,
            fileUrl: uploadResult.url
        });
        
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ error: 'Failed to upload document' });
    }
});

// Delete document
router.delete('/documents/:documentId', [authenticateToken, requireStudent], async (req, res) => {
    try {
        const userId = req.user.id;
        const documentId = req.params.documentId;
        
        // Get student info
        const student = database.get('SELECT * FROM students WHERE user_id = ?', [userId]);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        // Get document info
        const document = database.get(
            'SELECT * FROM student_documents WHERE id = ? AND student_id = ?',
            [documentId, student.id]
        );
        
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        // Delete from Azure Blob Storage
        await azureBlobService.deleteFile(document.blob_name);
        
        // Delete from database
        database.run('DELETE FROM student_documents WHERE id = ?', [documentId]);
        
        res.json({ message: 'Document deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
});

// Get documents
router.get('/documents', [authenticateToken, requireStudent], async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get student info
        const student = database.get('SELECT * FROM students WHERE user_id = ?', [userId]);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        // Get documents
        const documents = database.all(
            'SELECT * FROM student_documents WHERE student_id = ? ORDER BY uploaded_at DESC',
            [student.id]
        );
        
        res.json(documents);
        
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;