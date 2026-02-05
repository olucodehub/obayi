const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const database = require('../config/database');
const { authenticateToken, requireStudent, requireStudentOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage (we'll convert to base64)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images and PDFs
        const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images, PDFs, and Word documents are allowed.'), false);
        }
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
        const updateFields = req.body;

        // Separate user fields from student fields
        const userFields = {};
        const studentFields = {};

        if (updateFields.firstName) userFields.first_name = updateFields.firstName;
        if (updateFields.lastName) userFields.last_name = updateFields.lastName;
        if (updateFields.phone) userFields.phone = updateFields.phone;

        if (updateFields.dateOfBirth) studentFields.date_of_birth = updateFields.dateOfBirth;
        if (updateFields.gender) studentFields.gender = updateFields.gender;
        if (updateFields.address) studentFields.address = updateFields.address;
        if (updateFields.city) studentFields.city = updateFields.city;
        if (updateFields.country) studentFields.country = updateFields.country;
        if (updateFields.schoolName) studentFields.school_name = updateFields.schoolName;
        if (updateFields.gradeLevel) studentFields.grade_level = updateFields.gradeLevel;
        if (updateFields.fieldOfStudy) studentFields.field_of_study = updateFields.fieldOfStudy;
        if (updateFields.emergencyContactName) studentFields.emergency_contact_name = updateFields.emergencyContactName;
        if (updateFields.emergencyContactPhone) studentFields.emergency_contact_phone = updateFields.emergencyContactPhone;
        if (updateFields.guardianName) studentFields.guardian_name = updateFields.guardianName;
        if (updateFields.guardianPhone) studentFields.guardian_phone = updateFields.guardianPhone;
        if (updateFields.guardianEmail) studentFields.guardian_email = updateFields.guardianEmail;
        if (updateFields.bio) studentFields.bio = updateFields.bio;

        // Update user table
        if (Object.keys(userFields).length > 0) {
            const keys = Object.keys(userFields);
            const placeholders = keys.map((_, index) => `${keys[index]} = $${index + 1}`).join(', ');
            const userUpdateQuery = `UPDATE users SET ${placeholders}, updated_at = CURRENT_TIMESTAMP WHERE id = $${keys.length + 1}`;
            const userUpdateParams = [...Object.values(userFields), userId];
            await database.run(userUpdateQuery, userUpdateParams);
        }

        // Update student table
        if (Object.keys(studentFields).length > 0) {
            const keys = Object.keys(studentFields);
            const placeholders = keys.map((_, index) => `${keys[index]} = $${index + 1}`).join(', ');
            const studentUpdateQuery = `UPDATE students SET ${placeholders}, updated_at = CURRENT_TIMESTAMP WHERE user_id = $${keys.length + 1}`;
            const studentUpdateParams = [...Object.values(studentFields), userId];
            await database.run(studentUpdateQuery, studentUpdateParams);
        }

        res.json({ message: 'Profile updated successfully' });

    } catch (error) {
        console.error('Update student profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Upload profile picture
router.post('/profile-picture', 
    authenticateToken, 
    requireStudent, 
    upload.single('profilePicture'), 
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const userId = req.user.id;
            
            // Convert file to base64
            const base64Data = req.file.buffer.toString('base64');
            const dataUrl = `data:${req.file.mimetype};base64,${base64Data}`;

            // Update profile picture in database
            await database.run(
                'UPDATE students SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
                [dataUrl, userId]
            );

            res.json({ 
                message: 'Profile picture uploaded successfully',
                profilePicture: dataUrl
            });

        } catch (error) {
            console.error('Upload profile picture error:', error);
            res.status(500).json({ error: 'Failed to upload profile picture' });
        }
    }
);

// Upload document (school results, receipts, certificates)
router.post('/documents', [
    authenticateToken,
    requireStudent,
    upload.single('document'),
    body('documentType').isIn(['school_result', 'receipt', 'primary_certificate', 'secondary_certificate', 'university_certificate', 'other']),
    body('documentTitle').trim().isLength({ min: 1 }),
    body('description').optional().trim()
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
        const { documentType, documentTitle, description } = req.body;

        // Get student ID
        const student = await database.get(
            'SELECT id FROM students WHERE user_id = $1',
            [userId]
        );

        if (!student) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        // Convert file to base64
        const base64Data = req.file.buffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${base64Data}`;

        // Save document information
        const result = await database.run(`
            INSERT INTO student_documents
            (student_id, document_type, document_title, file_data, file_name, file_size, mime_type, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
            student.id,
            documentType,
            documentTitle,
            dataUrl,
            req.file.originalname,
            req.file.size,
            req.file.mimetype,
            description || null
        ]);

        res.json({ 
            message: 'Document uploaded successfully',
            documentId: result.id
        });

    } catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({ error: 'Failed to upload document' });
    }
});

// Get student's own documents
router.get('/documents', authenticateToken, requireStudent, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get student ID
        const student = await database.get(
            'SELECT id FROM students WHERE user_id = $1',
            [userId]
        );

        if (!student) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        // Get documents
        const documents = await database.all(`
            SELECT id, document_type, document_title, file_name, file_size,
                   uploaded_at, description, mime_type
            FROM student_documents
            WHERE student_id = $1
            ORDER BY uploaded_at DESC
        `, [student.id]);

        res.json({ documents });

    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ error: 'Failed to get documents' });
    }
});

// Delete document
router.delete('/documents/:documentId', authenticateToken, requireStudent, async (req, res) => {
    try {
        const userId = req.user.id;
        const documentId = req.params.documentId;

        // Get student ID and document
        const student = await database.get(
            'SELECT id FROM students WHERE user_id = $1',
            [userId]
        );

        if (!student) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        const document = await database.get(
            'SELECT * FROM student_documents WHERE id = $1 AND student_id = $2',
            [documentId, student.id]
        );

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // File is stored as base64 in database, no filesystem cleanup needed

        // Delete from database
        await database.run(
            'DELETE FROM student_documents WHERE id = $1',
            [documentId]
        );

        res.json({ message: 'Document deleted successfully' });

    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
});

// Get assigned donors for the logged-in student
router.get('/donors', authenticateToken, requireStudent, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get student ID
        const student = await database.get(
            'SELECT id FROM students WHERE user_id = $1',
            [userId]
        );

        if (!student) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        // Get assigned donors
        const donors = await database.all(`
            SELECT
                d.id,
                d.organization,
                d.address,
                d.city,
                d.country,
                d.donation_amount,
                d.donation_frequency,
                d.preferred_contact,
                d.bio,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                dsa.assigned_at,
                dsa.notes as assignment_notes
            FROM donor_student_assignments dsa
            JOIN donors d ON dsa.donor_id = d.id
            JOIN users u ON d.user_id = u.id
            WHERE dsa.student_id = $1 AND dsa.is_active = TRUE AND u.is_active = TRUE
            ORDER BY dsa.assigned_at DESC
        `, [student.id]);

        res.json({ donors });

    } catch (error) {
        console.error('Get assigned donors error:', error);
        res.status(500).json({ error: 'Failed to get assigned donors' });
    }
});

// Get donor count (how many donors are supporting this student)
router.get('/donor-count', authenticateToken, requireStudent, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get student ID
        const student = await database.get(
            'SELECT id FROM students WHERE user_id = $1',
            [userId]
        );

        if (!student) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        // Get donor count
        const result = await database.get(`
            SELECT COUNT(*) as count
            FROM donor_student_assignments dsa
            JOIN donors d ON dsa.donor_id = d.id
            JOIN users u ON d.user_id = u.id
            WHERE dsa.student_id = $1 AND dsa.is_active = TRUE AND u.is_active = TRUE
        `, [student.id]);

        res.json({ donorCount: result.count });

    } catch (error) {
        console.error('Get donor count error:', error);
        res.status(500).json({ error: 'Failed to get donor count' });
    }
});

// Get document data (base64)
router.get('/documents/:documentId/data', authenticateToken, requireStudent, async (req, res) => {
    try {
        const userId = req.user.id;
        const documentId = req.params.documentId;

        // Get student ID
        const student = await database.get(
            'SELECT id FROM students WHERE user_id = $1',
            [userId]
        );

        if (!student) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        // Get document
        const document = await database.get(
            'SELECT file_data, file_name, mime_type FROM student_documents WHERE id = $1 AND student_id = $2',
            [documentId, student.id]
        );

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.json({
            fileData: document.file_data,
            fileName: document.file_name,
            mimeType: document.mime_type
        });

    } catch (error) {
        console.error('Get document data error:', error);
        res.status(500).json({ error: 'Failed to get document data' });
    }
});

module.exports = router;