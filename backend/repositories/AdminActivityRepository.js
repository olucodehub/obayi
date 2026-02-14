/**
 * Admin Activity Repository
 * Tracks all admin actions for audit purposes
 */

const BaseRepository = require('./BaseRepository');

class AdminActivityRepository extends BaseRepository {
    constructor(database) {
        super(database, 'admin_activity_log');
    }

    /**
     * Log admin activity
     */
    async logActivity(adminId, action, entityType, entityId, details = null) {
        return await this.create({
            admin_id: adminId,
            action,
            entity_type: entityType,
            entity_id: entityId,
            details,
            ip_address: null, // Can be added later from request
            user_agent: null  // Can be added later from request
        });
    }

    /**
     * Get recent activities
     */
    async getRecentActivities(limit = 50) {
        return await this.query(`
            SELECT
                aal.*,
                u.first_name,
                u.last_name,
                u.email
            FROM admin_activity_log aal
            JOIN users u ON aal.admin_id = u.id
            ORDER BY aal.created_at DESC
            LIMIT $1
        `, [limit]);
    }

    /**
     * Get activities by admin
     */
    async getActivitiesByAdmin(adminId, limit = 50) {
        return await this.query(`
            SELECT * FROM admin_activity_log
            WHERE admin_id = $1
            ORDER BY created_at DESC
            LIMIT $2
        `, [adminId, limit]);
    }

    /**
     * Get activities by entity
     */
    async getActivitiesByEntity(entityType, entityId) {
        return await this.query(`
            SELECT
                aal.*,
                u.first_name,
                u.last_name,
                u.email
            FROM admin_activity_log aal
            JOIN users u ON aal.admin_id = u.id
            WHERE aal.entity_type = $1 AND aal.entity_id = $2
            ORDER BY aal.created_at DESC
        `, [entityType, entityId]);
    }

    /**
     * Get activity statistics
     */
    async getActivityStats(days = 30) {
        return await this.queryOne(`
            SELECT
                COUNT(*) as total_activities,
                COUNT(DISTINCT admin_id) as active_admins,
                COUNT(CASE WHEN action = 'create_user' THEN 1 END) as users_created,
                COUNT(CASE WHEN action = 'create_assignment' THEN 1 END) as assignments_created,
                COUNT(CASE WHEN action = 'delete_user' THEN 1 END) as users_deleted
            FROM admin_activity_log
            WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '${days} days'
        `);
    }
}

module.exports = AdminActivityRepository;
