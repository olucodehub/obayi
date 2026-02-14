/**
 * User Repository
 * Handles all user-related database operations
 */

const BaseRepository = require('./BaseRepository');
const bcrypt = require('bcryptjs');

class UserRepository extends BaseRepository {
    constructor(database) {
        super(database, 'users');
    }

    /**
     * Get user by email
     */
    async findByEmail(email) {
        return await this.findOne({ email });
    }

    /**
     * Get active users by type
     */
    async findByType(userType) {
        return await this.findAll({ user_type: userType, is_active: true });
    }

    /**
     * Get user with profile (donor or student)
     */
    async findWithProfile(userId) {
        const user = await this.findById(userId);
        if (!user) return null;

        if (user.user_type === 'donor') {
            const profile = await this.db.get(
                'SELECT * FROM donors WHERE user_id = $1',
                [userId]
            );
            return { ...user, profile };
        } else if (user.user_type === 'student') {
            const profile = await this.db.get(
                'SELECT * FROM students WHERE user_id = $1',
                [userId]
            );
            return { ...user, profile };
        }

        return user;
    }

    /**
     * Create user with password hashing
     */
    async createUser(userData) {
        const { password, ...userDataWithoutPassword } = userData;

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const result = await this.create({
            ...userDataWithoutPassword,
            password_hash: passwordHash
        });

        return result;
    }

    /**
     * Verify user password
     */
    async verifyPassword(userId, password) {
        const user = await this.findById(userId);
        if (!user) return false;

        return await bcrypt.compare(password, user.password_hash);
    }

    /**
     * Update user password
     */
    async updatePassword(userId, newPassword) {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        return await this.execute(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [passwordHash, userId]
        );
    }

    /**
     * Get all donors with stats
     */
    async getAllDonorsWithStats() {
        return await this.query(`
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
            GROUP BY u.id, u.email, u.first_name, u.last_name, u.phone, u.created_at, u.is_active,
                     d.id, d.organization, d.city, d.country, d.donation_amount, d.donation_frequency
            ORDER BY u.created_at DESC
        `);
    }

    /**
     * Get all students with stats
     */
    async getAllStudentsWithStats() {
        return await this.query(`
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
            GROUP BY u.id, u.email, u.first_name, u.last_name, u.phone, u.created_at, u.is_active,
                     s.id, s.student_id, s.school_name, s.grade_level, s.field_of_study, s.city, s.country
            ORDER BY u.created_at DESC
        `);
    }

    /**
     * Get all admin users
     */
    async getAllAdmins() {
        return await this.findAll({ user_type: 'admin', is_active: true });
    }
}

module.exports = UserRepository;
