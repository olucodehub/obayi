const express = require('express');
const { body, validationResult } = require('express-validator');
const database = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const emailService = require('../utils/emailService');

const router = express.Router();

// Get all donors
router.get('/donors', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const donors = await database.all(`
            SELECT 
                u.id,
                u.email,
                u.first_name,
                u.last_name,
                u.phone,
                u.created_at,
                u.is_active,
                d.id as donor_id,
                d.organization,
                d.city,
                d.country,
                d.donation_amount,
                d.donation_frequency,
                COUNT(DISTINCT dsa.student_id) as assigned_students
            FROM users u
            JOIN donors d ON u.id = d.user_id
            LEFT JOIN donor_student_assignments dsa ON d.id = dsa.donor_id AND dsa.is_active = TRUE
            WHERE u.user_type = 'donor'
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `);

        res.json({ donors });

    } catch (error) {
        console.error('Get donors error:', error);
        res.status(500).json({ error: 'Failed to get donors' });
    }
});

// Get all students
router.get('/students', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const students = await database.all(`
            SELECT 
                u.id,
                u.email,
                u.first_name,
                u.last_name,
                u.phone,
                u.created_at,
                u.is_active,
                s.id as student_id,
                s.student_id as custom_student_id,
                s.school_name,
                s.grade_level,
                s.field_of_study,
                s.city,
                s.country,
                COUNT(DISTINCT dsa.donor_id) as assigned_donors,
                COUNT(DISTINCT sd.id) as document_count
            FROM users u
            JOIN students s ON u.id = s.user_id
            LEFT JOIN donor_student_assignments dsa ON s.id = dsa.student_id AND dsa.is_active = TRUE
            LEFT JOIN student_documents sd ON s.id = sd.student_id
            WHERE u.user_type = 'student'
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `);

        res.json({ students });

    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ error: 'Failed to get students' });
    }
});

// Get all assignments
router.get('/assignments', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const assignments = await database.all(`
            SELECT 
                dsa.id,
                dsa.assigned_at,
                dsa.is_active,
                dsa.notes,
                -- Donor info
                d.id as donor_id,
                du.first_name as donor_first_name,
                du.last_name as donor_last_name,
                du.email as donor_email,
                donor_info.organization,
                -- Student info
                s.id as student_id,
                s.student_id as custom_student_id,
                su.first_name as student_first_name,
                su.last_name as student_last_name,
                su.email as student_email,
                s.school_name,
                s.grade_level,
                -- Admin who assigned
                au.first_name as assigned_by_first_name,
                au.last_name as assigned_by_last_name
            FROM donor_student_assignments dsa
            JOIN donors d ON dsa.donor_id = d.id
            JOIN users du ON d.user_id = du.id
            JOIN students s ON dsa.student_id = s.id
            JOIN users su ON s.user_id = su.id
            JOIN users au ON dsa.assigned_by_admin_id = au.id
            LEFT JOIN donors donor_info ON d.id = donor_info.id
            WHERE dsa.is_active = TRUE AND du.is_active = TRUE AND su.is_active = TRUE
            ORDER BY dsa.assigned_at DESC
        `);

        res.json({ assignments });

    } catch (error) {
        console.error('Get assignments error:', error);
        res.status(500).json({ error: 'Failed to get assignments' });
    }
});

// Assign student to donor
router.post('/assign', [
    authenticateToken,
    requireAdmin,
    body('donorId').isInt({ min: 1 }),
    body('studentId').isInt({ min: 1 }),
    body('notes').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { donorId, studentId, notes } = req.body;
        const adminId = req.user.id;

        // Check if donor exists and is active
        const donor = await database.get(`
            SELECT d.id, u.is_active 
            FROM donors d 
            JOIN users u ON d.user_id = u.id 
            WHERE d.id = ?
        `, [donorId]);

        if (!donor || !donor.is_active) {
            return res.status(404).json({ error: 'Donor not found or inactive' });
        }

        // Check if student exists and is active
        const student = await database.get(`
            SELECT s.id, u.is_active 
            FROM students s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.id = ?
        `, [studentId]);

        if (!student || !student.is_active) {
            return res.status(404).json({ error: 'Student not found or inactive' });
        }

        // Check if assignment already exists
        const existingAssignment = await database.get(
            'SELECT id, is_active FROM donor_student_assignments WHERE donor_id = ? AND student_id = ?',
            [donorId, studentId]
        );

        if (existingAssignment) {
            if (existingAssignment.is_active) {
                return res.status(400).json({ error: 'Student is already assigned to this donor' });
            } else {
                // Reactivate existing assignment
                await database.run(
                    'UPDATE donor_student_assignments SET is_active = TRUE, assigned_at = datetime(\'now\'), assigned_by_admin_id = ?, notes = ? WHERE id = ?',
                    [adminId, notes || null, existingAssignment.id]
                );
                
                res.json({ message: 'Student assignment reactivated successfully' });
                return;
            }
        }

        // Create new assignment
        const result = await database.run(
            'INSERT INTO donor_student_assignments (donor_id, student_id, assigned_by_admin_id, notes) VALUES (?, ?, ?, ?)',
            [donorId, studentId, adminId, notes || null]
        );

        // Get donor and student details for email notification
        const donorDetails = await database.get(`
            SELECT u.email, u.first_name, u.last_name, d.organization
            FROM users u
            JOIN donors d ON u.id = d.user_id
            WHERE d.id = ?
        `, [donorId]);

        const studentDetails = await database.get(`
            SELECT u.email, u.first_name, u.last_name, s.school_name, s.grade_level
            FROM users u
            JOIN students s ON u.id = s.user_id
            WHERE s.id = ?
        `, [studentId]);

        // Send assignment notification emails asynchronously
        if (donorDetails && studentDetails) {
            emailService.sendDonorAssignmentEmail({
                donorEmail: donorDetails.email,
                donorFirstName: donorDetails.first_name,
                donorLastName: donorDetails.last_name,
                studentFirstName: studentDetails.first_name,
                studentLastName: studentDetails.last_name,
                studentSchool: studentDetails.school_name,
                studentGradeLevel: studentDetails.grade_level
            }).catch(err => console.error('Email service error:', err));

            emailService.sendStudentAssignmentEmail({
                studentEmail: studentDetails.email,
                studentFirstName: studentDetails.first_name,
                studentLastName: studentDetails.last_name,
                donorFirstName: donorDetails.first_name,
                donorLastName: donorDetails.last_name,
                donorOrganization: donorDetails.organization
            }).catch(err => console.error('Email service error:', err));
        }

        res.json({
            message: 'Student assigned to donor successfully',
            assignmentId: result.id
        });

    } catch (error) {
        console.error('Assign student error:', error);
        res.status(500).json({ error: 'Failed to assign student to donor' });
    }
});

// Unassign student from donor
router.post('/unassign', [
    authenticateToken,
    requireAdmin,
    body('donorId').isInt({ min: 1 }),
    body('studentId').isInt({ min: 1 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { donorId, studentId } = req.body;

        // Check if assignment exists
        const assignment = await database.get(
            'SELECT id FROM donor_student_assignments WHERE donor_id = ? AND student_id = ? AND is_active = TRUE',
            [donorId, studentId]
        );

        if (!assignment) {
            return res.status(404).json({ error: 'Active assignment not found' });
        }

        // Deactivate assignment
        await database.run(
            'UPDATE donor_student_assignments SET is_active = FALSE WHERE id = ?',
            [assignment.id]
        );

        res.json({ message: 'Student unassigned from donor successfully' });

    } catch (error) {
        console.error('Unassign student error:', error);
        res.status(500).json({ error: 'Failed to unassign student from donor' });
    }
});

// Get detailed donor information
router.get('/donors/:donorId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const donorId = req.params.donorId;

        const donor = await database.get(`
            SELECT 
                u.*,
                d.organization,
                d.address,
                d.city,
                d.country,
                d.donation_amount,
                d.donation_frequency,
                d.preferred_contact,
                d.bio
            FROM users u
            JOIN donors d ON u.id = d.user_id
            WHERE d.id = ?
        `, [donorId]);

        if (!donor) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        // Get assigned students
        const students = await database.all(`
            SELECT 
                s.id,
                s.student_id as custom_student_id,
                u.first_name,
                u.last_name,
                s.school_name,
                s.grade_level,
                dsa.assigned_at,
                dsa.notes
            FROM donor_student_assignments dsa
            JOIN students s ON dsa.student_id = s.id
            JOIN users u ON s.user_id = u.id
            WHERE dsa.donor_id = ? AND dsa.is_active = TRUE AND u.is_active = TRUE
            ORDER BY dsa.assigned_at DESC
        `, [donorId]);

        // Remove password hash
        delete donor.password_hash;

        res.json({ 
            donor: {
                ...donor,
                assignedStudents: students
            }
        });

    } catch (error) {
        console.error('Get donor details error:', error);
        res.status(500).json({ error: 'Failed to get donor details' });
    }
});

// Get detailed student information
router.get('/students/:studentId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const student = await database.get(`
            SELECT 
                u.*,
                s.*
            FROM users u
            JOIN students s ON u.id = s.user_id
            WHERE s.id = ?
        `, [studentId]);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Get assigned donors
        const donors = await database.all(`
            SELECT 
                d.id,
                u.first_name,
                u.last_name,
                u.email,
                donor_info.organization,
                dsa.assigned_at,
                dsa.notes
            FROM donor_student_assignments dsa
            JOIN donors d ON dsa.donor_id = d.id
            JOIN users u ON d.user_id = u.id
            LEFT JOIN donors donor_info ON d.id = donor_info.id
            WHERE dsa.student_id = ? AND dsa.is_active = TRUE AND u.is_active = TRUE
            ORDER BY dsa.assigned_at DESC
        `, [studentId]);

        // Get documents
        const documents = await database.all(`
            SELECT id, document_type, document_title, file_name, file_size, 
                   uploaded_at, description
            FROM student_documents 
            WHERE student_id = ? 
            ORDER BY uploaded_at DESC
        `, [studentId]);

        // Remove password hash
        delete student.password_hash;

        res.json({ 
            student: {
                ...student,
                assignedDonors: donors,
                documents: documents
            }
        });

    } catch (error) {
        console.error('Get student details error:', error);
        res.status(500).json({ error: 'Failed to get student details' });
    }
});

// Remove donor from platform
router.delete('/donors/:donorId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const donorId = req.params.donorId;

        // Get donor's user ID
        const donor = await database.get(
            'SELECT user_id FROM donors WHERE id = ?',
            [donorId]
        );

        if (!donor) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        // Deactivate user account
        await database.run(
            'UPDATE users SET is_active = FALSE, updated_at = datetime(\'now\') WHERE id = ?',
            [donor.user_id]
        );

        // Deactivate all assignments
        await database.run(
            'UPDATE donor_student_assignments SET is_active = FALSE WHERE donor_id = ?',
            [donorId]
        );

        res.json({ message: 'Donor removed from platform successfully' });

    } catch (error) {
        console.error('Remove donor error:', error);
        res.status(500).json({ error: 'Failed to remove donor' });
    }
});

// Remove student from platform
router.delete('/students/:studentId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const studentId = req.params.studentId;

        // Get student's user ID
        const student = await database.get(
            'SELECT user_id FROM students WHERE id = ?',
            [studentId]
        );

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Deactivate user account
        await database.run(
            'UPDATE users SET is_active = FALSE, updated_at = datetime(\'now\') WHERE id = ?',
            [student.user_id]
        );

        // Deactivate all assignments
        await database.run(
            'UPDATE donor_student_assignments SET is_active = FALSE WHERE student_id = ?',
            [studentId]
        );

        res.json({ message: 'Student removed from platform successfully' });

    } catch (error) {
        console.error('Remove student error:', error);
        res.status(500).json({ error: 'Failed to remove student' });
    }
});

// Get platform statistics
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
    try {
        // Get counts
        const [donorCount, studentCount, assignmentCount, documentCount] = await Promise.all([
            database.get('SELECT COUNT(*) as count FROM users WHERE user_type = "donor" AND is_active = TRUE'),
            database.get('SELECT COUNT(*) as count FROM users WHERE user_type = "student" AND is_active = TRUE'),
            database.get('SELECT COUNT(*) as count FROM donor_student_assignments WHERE is_active = TRUE'),
            database.get('SELECT COUNT(*) as count FROM student_documents')
        ]);

        // Get recent activity
        const recentAssignments = await database.all(`
            SELECT 
                dsa.assigned_at,
                du.first_name as donor_first_name,
                du.last_name as donor_last_name,
                su.first_name as student_first_name,
                su.last_name as student_last_name
            FROM donor_student_assignments dsa
            JOIN donors d ON dsa.donor_id = d.id
            JOIN users du ON d.user_id = du.id
            JOIN students s ON dsa.student_id = s.id
            JOIN users su ON s.user_id = su.id
            WHERE dsa.is_active = TRUE
            ORDER BY dsa.assigned_at DESC
            LIMIT 10
        `);

        res.json({
            stats: {
                totalDonors: donorCount.count,
                totalStudents: studentCount.count,
                totalAssignments: assignmentCount.count,
                totalDocuments: documentCount.count
            },
            recentActivity: recentAssignments
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to get platform statistics' });
    }
});

module.exports = router;