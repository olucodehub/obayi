const jwt = require('jsonwebtoken');
const database = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get user details from database
        const user = await database.get(
            'SELECT * FROM users WHERE id = ? AND is_active = TRUE',
            [decoded.userId]
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid token or user not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// Middleware to check if user has specific role
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const userRoles = Array.isArray(roles) ? roles : [roles];
        
        if (!userRoles.includes(req.user.user_type)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};

// Middleware for admin only
const requireAdmin = requireRole('admin');

// Middleware for donor only
const requireDonor = requireRole('donor');

// Middleware for student only
const requireStudent = requireRole('student');

// Middleware for donor or admin
const requireDonorOrAdmin = requireRole(['donor', 'admin']);

// Middleware for student or admin
const requireStudentOrAdmin = requireRole(['student', 'admin']);

module.exports = {
    authenticateToken,
    requireRole,
    requireAdmin,
    requireDonor,
    requireStudent,
    requireDonorOrAdmin,
    requireStudentOrAdmin
};