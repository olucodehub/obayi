const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const database = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const emailService = require('../utils/emailService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to generate JWT token
const generateToken = (userId, userType) => {
    return jwt.sign(
        { userId, userType },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Register endpoint
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().isLength({ min: 1 }),
    body('lastName').trim().isLength({ min: 1 }),
    body('userType').isIn(['donor', 'student']),
    body('phone').optional().trim(),
    body('bio').optional().trim(),
    // Student fields
    body('school').optional().trim(),
    body('gradeLevel').optional().trim(),
    body('dateOfBirth').optional().trim(),
    body('guardianName').optional().trim(),
    body('guardianPhone').optional().trim(),
    body('address').optional().trim(),
    // Donor fields
    body('occupation').optional().trim(),
    body('company').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Registration validation errors:', errors.array());
            console.log('Request body:', JSON.stringify(req.body, null, 2));
            return res.status(400).json({ errors: errors.array() });
        }

        const { 
            email, password, firstName, lastName, userType, phone, bio,
            // Student fields
            school, gradeLevel, dateOfBirth, guardianName, guardianPhone, address,
            // Donor fields
            occupation, company
        } = req.body;

        // Check if user already exists
        const existingUser = await database.get(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const result = await database.run(
            'INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
            [email, passwordHash, userType, firstName, lastName, phone]
        );

        const userId = result.id;

        // Create specific profile based on user type
        if (userType === 'donor') {
            await database.run(
                'INSERT INTO donors (user_id, organization, bio) VALUES (?, ?, ?)',
                [userId, company, bio]
            );
        } else if (userType === 'student') {
            // Generate student ID
            const studentId = `STU${Date.now()}`;
            await database.run(
                'INSERT INTO students (user_id, student_id, school_name, grade_level, date_of_birth, guardian_name, guardian_phone, address, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, studentId, school, gradeLevel, dateOfBirth, guardianName, guardianPhone, address, bio]
            );
        }

        const token = generateToken(userId, userType);

        // Send welcome email asynchronously (don't wait for it)
        if (userType === 'donor') {
            emailService.sendDonorWelcomeEmail({
                email,
                firstName,
                lastName
            }).catch(err => console.error('Email service error:', err));
        } else if (userType === 'student') {
            const studentId = `STU${Date.now()}`;
            emailService.sendStudentWelcomeEmail({
                email,
                firstName,
                lastName,
                studentId,
                school
            }).catch(err => console.error('Email service error:', err));
        }

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: userId,
                email,
                firstName,
                lastName,
                userType
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login endpoint
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Get user
        const user = await database.get(
            'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
            [email]
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id, user.user_type);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                userType: user.user_type
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Request password reset
router.post('/forgot-password', [
    body('email').isEmail().normalizeEmail()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        // Check if user exists
        const user = await database.get(
            'SELECT id FROM users WHERE email = ? AND is_active = TRUE',
            [email]
        );

        if (!user) {
            // Don't reveal if email exists or not
            return res.json({ message: 'If the email exists, a reset link has been sent' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

        // Store reset token
        await database.run(
            'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [user.id, resetToken, expiresAt.toISOString()]
        );

        // In a real app, you would send an email here
        console.log(`Password reset token for ${email}: ${resetToken}`);

        res.json({ 
            message: 'If the email exists, a reset link has been sent',
            // TODO: Remove this in production
            resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
        });

    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({ error: 'Failed to process password reset request' });
    }
});

// Reset password
router.post('/reset-password', [
    body('token').exists(),
    body('newPassword').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { token, newPassword } = req.body;

        // Find valid reset token
        const resetRecord = await database.get(
            `SELECT rt.*, u.id as user_id 
             FROM password_reset_tokens rt 
             JOIN users u ON rt.user_id = u.id 
             WHERE rt.token = ? AND rt.used = FALSE AND rt.expires_at > datetime('now') 
             AND u.is_active = TRUE`,
            [token]
        );

        if (!resetRecord) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update password
        await database.run(
            'UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?',
            [passwordHash, resetRecord.user_id]
        );

        // Mark token as used
        await database.run(
            'UPDATE password_reset_tokens SET used = TRUE WHERE id = ?',
            [resetRecord.id]
        );

        res.json({ message: 'Password reset successful' });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.user_type;

        let profileQuery;
        let profileParams;

        if (userType === 'donor') {
            profileQuery = `
                SELECT u.*, d.organization, d.address, d.city, d.country, 
                       d.donation_amount, d.donation_frequency, d.preferred_contact, d.bio
                FROM users u 
                LEFT JOIN donors d ON u.id = d.user_id 
                WHERE u.id = ?
            `;
            profileParams = [userId];
        } else if (userType === 'student') {
            profileQuery = `
                SELECT u.*, s.student_id, s.date_of_birth, s.gender, s.address, 
                       s.city, s.country, s.school_name, s.grade_level, s.field_of_study,
                       s.profile_picture, s.emergency_contact_name, s.emergency_contact_phone,
                       s.guardian_name, s.guardian_phone, s.guardian_email, s.bio
                FROM users u 
                LEFT JOIN students s ON u.id = s.user_id 
                WHERE u.id = ?
            `;
            profileParams = [userId];
        } else {
            profileQuery = 'SELECT * FROM users WHERE id = ?';
            profileParams = [userId];
        }

        const profile = await database.get(profileQuery, profileParams);

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Remove sensitive data
        delete profile.password_hash;

        res.json({ profile });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Update user profile
router.put('/profile', [
    authenticateToken,
    body('firstName').optional().trim().isLength({ min: 1 }),
    body('lastName').optional().trim().isLength({ min: 1 }),
    body('phone').optional().trim(),
    body('bio').optional().trim(),
    // Student specific fields
    body('school').optional().trim(),
    body('gradeLevel').optional().trim(),
    body('dateOfBirth').optional().trim(),
    body('guardianName').optional().trim(),
    body('guardianPhone').optional().trim(),
    body('address').optional().trim(),
    body('city').optional().trim(),
    body('country').optional().trim(),
    body('fieldOfStudy').optional().trim(),
    // Donor specific fields
    body('organization').optional().trim(),
    body('donationAmount').optional().isNumeric(),
    body('donationFrequency').optional().isIn(['one-time', 'monthly', 'quarterly', 'yearly']),
    body('preferredContact').optional().isIn(['email', 'phone', 'both'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user.id;
        const userType = req.user.user_type;
        
        const {
            firstName, lastName, phone, bio,
            // Student fields
            school, gradeLevel, dateOfBirth, guardianName, guardianPhone, 
            address, city, country, fieldOfStudy,
            // Donor fields
            organization, donationAmount, donationFrequency, preferredContact
        } = req.body;

        // Update users table
        const userFields = [];
        const userValues = [];
        
        if (firstName !== undefined) { userFields.push('first_name = ?'); userValues.push(firstName); }
        if (lastName !== undefined) { userFields.push('last_name = ?'); userValues.push(lastName); }
        if (phone !== undefined) { userFields.push('phone = ?'); userValues.push(phone); }
        
        if (userFields.length > 0) {
            userFields.push('updated_at = datetime(\'now\')');
            userValues.push(userId);
            await database.run(
                `UPDATE users SET ${userFields.join(', ')} WHERE id = ?`,
                userValues
            );
        }

        // Update type-specific table
        if (userType === 'student') {
            const studentFields = [];
            const studentValues = [];
            
            if (school !== undefined) { studentFields.push('school_name = ?'); studentValues.push(school); }
            if (gradeLevel !== undefined) { studentFields.push('grade_level = ?'); studentValues.push(gradeLevel); }
            if (dateOfBirth !== undefined) { studentFields.push('date_of_birth = ?'); studentValues.push(dateOfBirth); }
            if (guardianName !== undefined) { studentFields.push('guardian_name = ?'); studentValues.push(guardianName); }
            if (guardianPhone !== undefined) { studentFields.push('guardian_phone = ?'); studentValues.push(guardianPhone); }
            if (address !== undefined) { studentFields.push('address = ?'); studentValues.push(address); }
            if (city !== undefined) { studentFields.push('city = ?'); studentValues.push(city); }
            if (country !== undefined) { studentFields.push('country = ?'); studentValues.push(country); }
            if (fieldOfStudy !== undefined) { studentFields.push('field_of_study = ?'); studentValues.push(fieldOfStudy); }
            if (bio !== undefined) { studentFields.push('bio = ?'); studentValues.push(bio); }
            
            if (studentFields.length > 0) {
                studentFields.push('updated_at = datetime(\'now\')');
                studentValues.push(userId);
                await database.run(
                    `UPDATE students SET ${studentFields.join(', ')} WHERE user_id = ?`,
                    studentValues
                );
            }
        } else if (userType === 'donor') {
            const donorFields = [];
            const donorValues = [];
            
            if (organization !== undefined) { donorFields.push('organization = ?'); donorValues.push(organization); }
            if (address !== undefined) { donorFields.push('address = ?'); donorValues.push(address); }
            if (city !== undefined) { donorFields.push('city = ?'); donorValues.push(city); }
            if (country !== undefined) { donorFields.push('country = ?'); donorValues.push(country); }
            if (donationAmount !== undefined) { donorFields.push('donation_amount = ?'); donorValues.push(donationAmount); }
            if (donationFrequency !== undefined) { donorFields.push('donation_frequency = ?'); donorValues.push(donationFrequency); }
            if (preferredContact !== undefined) { donorFields.push('preferred_contact = ?'); donorValues.push(preferredContact); }
            if (bio !== undefined) { donorFields.push('bio = ?'); donorValues.push(bio); }
            
            if (donorFields.length > 0) {
                donorFields.push('updated_at = datetime(\'now\')');
                donorValues.push(userId);
                await database.run(
                    `UPDATE donors SET ${donorFields.join(', ')} WHERE user_id = ?`,
                    donorValues
                );
            }
        }

        res.json({ message: 'Profile updated successfully' });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Change password
router.put('/change-password', [
    authenticateToken,
    body('currentPassword').exists(),
    body('newPassword').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Get current user
        const user = await database.get(
            'SELECT password_hash FROM users WHERE id = ?',
            [userId]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Update password
        await database.run(
            'UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?',
            [newPasswordHash, userId]
        );

        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

module.exports = router;