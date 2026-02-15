const express = require('express');
const { body, validationResult } = require('express-validator');
const database = require('../config/database');
const { authenticateToken, requireDonor, requireDonorOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Update donor profile
router.put('/profile', [
    authenticateToken,
    requireDonor,
    body('firstName').optional().trim().isLength({ min: 1 }),
    body('lastName').optional().trim().isLength({ min: 1 }),
    body('phone').optional().trim(),
    body('organization').optional().trim(),
    body('address').optional().trim(),
    body('city').optional().trim(),
    body('country').optional().trim(),
    body('donationAmount').optional().isNumeric(),
    body('donationFrequency').optional().isIn(['one-time', 'monthly', 'quarterly', 'yearly']),
    body('preferredContact').optional().isIn(['email', 'phone', 'both']),
    body('bio').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user.id;
        const updateFields = req.body;

        // Separate user fields from donor fields
        const userFields = {};
        const donorFields = {};

        if (updateFields.firstName) userFields.first_name = updateFields.firstName;
        if (updateFields.lastName) userFields.last_name = updateFields.lastName;
        if (updateFields.phone) userFields.phone = updateFields.phone;

        if (updateFields.organization) donorFields.organization = updateFields.organization;
        if (updateFields.address) donorFields.address = updateFields.address;
        if (updateFields.city) donorFields.city = updateFields.city;
        if (updateFields.country) donorFields.country = updateFields.country;
        if (updateFields.donationAmount) donorFields.donation_amount = updateFields.donationAmount;
        if (updateFields.donationFrequency) donorFields.donation_frequency = updateFields.donationFrequency;
        if (updateFields.preferredContact) donorFields.preferred_contact = updateFields.preferredContact;
        if (updateFields.bio) donorFields.bio = updateFields.bio;

        // Update user table
        if (Object.keys(userFields).length > 0) {
            const userUpdateQuery = `UPDATE users SET ${Object.keys(userFields).map((key, i) => `${key} = $${i + 1}`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${Object.keys(userFields).length + 1}`;
            const userUpdateParams = [...Object.values(userFields), userId];
            await database.run(userUpdateQuery, userUpdateParams);
        }

        // Update donor table
        if (Object.keys(donorFields).length > 0) {
            const donorUpdateQuery = `UPDATE donors SET ${Object.keys(donorFields).map((key, i) => `${key} = $${i + 1}`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = $${Object.keys(donorFields).length + 1}`;
            const donorUpdateParams = [...Object.values(donorFields), userId];
            await database.run(donorUpdateQuery, donorUpdateParams);
        }

        res.json({ message: 'Profile updated successfully' });

    } catch (error) {
        console.error('Update donor profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Get assigned students for the logged-in donor
router.get('/students', authenticateToken, requireDonor, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get donor ID
        const donor = await database.get(
            'SELECT id FROM donors WHERE user_id = $1',
            [userId]
        );

        if (!donor) {
            return res.status(404).json({ error: 'Donor profile not found' });
        }

        // Get assigned students
        const students = await database.all(`
            SELECT
                s.id,
                s.user_id,
                s.student_id,
                s.date_of_birth,
                s.gender,
                s.address,
                s.city,
                s.country,
                s.school_name,
                s.grade_level,
                s.field_of_study,
                s.profile_picture_url,
                s.emergency_contact_name,
                s.emergency_contact_phone,
                s.guardian_name,
                s.guardian_phone,
                s.guardian_email,
                s.bio,
                s.created_at,
                s.updated_at,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                dsa.assigned_at,
                dsa.notes as assignment_notes,
                COUNT(DISTINCT sd.id) as document_count,
                COUNT(DISTINCT dsa2.donor_id) as total_donors
            FROM donor_student_assignments dsa
            JOIN students s ON dsa.student_id = s.id
            JOIN users u ON s.user_id = u.id
            LEFT JOIN student_documents sd ON s.id = sd.student_id
            LEFT JOIN donor_student_assignments dsa2 ON s.id = dsa2.student_id AND dsa2.is_active = TRUE
            WHERE dsa.donor_id = $1 AND dsa.is_active = TRUE AND u.is_active = TRUE
            GROUP BY s.id, s.user_id, s.student_id, s.date_of_birth, s.gender, s.address, s.city, s.country,
                     s.school_name, s.grade_level, s.field_of_study, s.profile_picture_url,
                     s.emergency_contact_name, s.emergency_contact_phone, s.guardian_name, s.guardian_phone,
                     s.guardian_email, s.bio, s.created_at, s.updated_at,
                     u.first_name, u.last_name, u.email, u.phone, dsa.assigned_at, dsa.notes
            ORDER BY dsa.assigned_at DESC
        `, [donor.id]);

        // Fetch documents for each student
        const formattedStudents = await Promise.all(students.map(async (student) => {
            // Get documents for this student
            const documents = await database.all(
                'SELECT * FROM student_documents WHERE student_id = $1 ORDER BY uploaded_at DESC',
                [student.id]
            );

            return {
                id: student.id,
                userId: student.user_id,
                studentId: student.student_id,
                email: student.email,
                firstName: student.first_name,
                lastName: student.last_name,
                phone: student.phone,
                userType: 'student',
                dateOfBirth: student.date_of_birth,
                gender: student.gender,
                address: student.address,
                city: student.city,
                country: student.country,
                schoolName: student.school_name,
                gradeLevel: student.grade_level,
                fieldOfStudy: student.field_of_study,
                profilePicture: student.profile_picture_url,
                emergencyContactName: student.emergency_contact_name,
                emergencyContactPhone: student.emergency_contact_phone,
                guardianName: student.guardian_name,
                guardianPhone: student.guardian_phone,
                guardianEmail: student.guardian_email,
                bio: student.bio,
                assignedAt: student.assigned_at,
                assignmentNotes: student.assignment_notes,
                documentCount: parseInt(student.document_count) || 0,
                totalDonors: parseInt(student.total_donors) || 0,
                documents: documents.map(doc => ({
                    id: doc.id,
                    documentTitle: doc.document_title,
                    documentType: doc.document_type,
                    fileName: doc.file_name,
                    fileUrl: doc.file_url,
                    uploadedAt: doc.uploaded_at,
                    description: doc.description,
                    amount: doc.amount
                })),
                createdAt: student.created_at,
                updatedAt: student.updated_at
            };
        }));

        res.json({ students: formattedStudents });

    } catch (error) {
        console.error('Get assigned students error:', error);
        res.status(500).json({ error: 'Failed to get assigned students' });
    }
});

// Get detailed information about a specific assigned student
router.get('/students/:studentId', authenticateToken, requireDonor, async (req, res) => {
    try {
        const userId = req.user.id;
        const studentId = req.params.studentId;

        // Get donor ID
        const donor = await database.get(
            'SELECT id FROM donors WHERE user_id = $1',
            [userId]
        );

        if (!donor) {
            return res.status(404).json({ error: 'Donor profile not found' });
        }

        // Check if student is assigned to this donor
        const assignment = await database.get(`
            SELECT dsa.*, s.*, u.first_name, u.last_name, u.email, u.phone, u.created_at as user_created_at
            FROM donor_student_assignments dsa
            JOIN students s ON dsa.student_id = s.id
            JOIN users u ON s.user_id = u.id
            WHERE dsa.donor_id = $1 AND s.id = $2 AND dsa.is_active = TRUE AND u.is_active = TRUE
        `, [donor.id, studentId]);

        if (!assignment) {
            return res.status(404).json({ error: 'Student not found or not assigned to you' });
        }

        // Get student documents
        const documents = await database.all(`
            SELECT id, document_type, document_title, file_name, file_size,
                   uploaded_at, description, mime_type
            FROM student_documents
            WHERE student_id = $1
            ORDER BY uploaded_at DESC
        `, [studentId]);

        // Get total number of donors supporting this student
        const donorCount = await database.get(
            'SELECT COUNT(*) as count FROM donor_student_assignments WHERE student_id = $1 AND is_active = TRUE',
            [studentId]
        );

        // Remove sensitive data and prepare response
        const studentDetails = {
            id: assignment.id,
            studentId: assignment.student_id,
            customStudentId: assignment.student_id,
            firstName: assignment.first_name,
            lastName: assignment.last_name,
            email: assignment.email,
            phone: assignment.phone,
            dateOfBirth: assignment.date_of_birth,
            gender: assignment.gender,
            address: assignment.address,
            city: assignment.city,
            country: assignment.country,
            schoolName: assignment.school_name,
            gradeLevel: assignment.grade_level,
            fieldOfStudy: assignment.field_of_study,
            profilePicture: assignment.profile_picture,
            emergencyContactName: assignment.emergency_contact_name,
            emergencyContactPhone: assignment.emergency_contact_phone,
            guardianName: assignment.guardian_name,
            guardianPhone: assignment.guardian_phone,
            guardianEmail: assignment.guardian_email,
            bio: assignment.bio,
            assignedAt: assignment.assigned_at,
            assignmentNotes: assignment.notes,
            totalDonors: donorCount.count,
            documents: documents,
            createdAt: assignment.user_created_at
        };

        res.json({ student: studentDetails });

    } catch (error) {
        console.error('Get student details error:', error);
        res.status(500).json({ error: 'Failed to get student details' });
    }
});

// Download student document (for assigned students only)
router.get('/students/:studentId/documents/:documentId/download',
    authenticateToken,
    requireDonor,
    async (req, res) => {
        try {
            const userId = req.user.id;
            const studentId = req.params.studentId;
            const documentId = req.params.documentId;

            // Get donor ID
            const donor = await database.get(
                'SELECT id FROM donors WHERE user_id = $1',
                [userId]
            );

            if (!donor) {
                return res.status(404).json({ error: 'Donor profile not found' });
            }

            // Check if student is assigned to this donor
            const assignment = await database.get(
                'SELECT id FROM donor_student_assignments WHERE donor_id = $1 AND student_id = $2 AND is_active = TRUE',
                [donor.id, studentId]
            );

            if (!assignment) {
                return res.status(403).json({ error: 'Access denied: Student not assigned to you' });
            }

            // Get document
            const document = await database.get(
                'SELECT file_url, file_name, mime_type FROM student_documents WHERE id = $1 AND student_id = $2',
                [documentId, studentId]
            );

            if (!document) {
                return res.status(404).json({ error: 'Document not found' });
            }

            if (!document.file_url) {
                return res.status(404).json({ error: 'File not available for download' });
            }

            // For now, redirect to the file URL (Azure Blob Storage)
            // In production, you might want to proxy the file or provide signed URLs
            res.redirect(document.file_url);

        } catch (error) {
            console.error('Download document error:', error);
            res.status(500).json({ error: 'Failed to download document' });
        }
    }
);

module.exports = router;
