-- Migration: Add admin activity logging table
-- This tracks all admin actions for audit purposes

CREATE TABLE IF NOT EXISTS admin_activity_log (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_entity ON admin_activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_action ON admin_activity_log(action);

-- Add comments for documentation
COMMENT ON TABLE admin_activity_log IS 'Audit log of all admin actions in the system';
COMMENT ON COLUMN admin_activity_log.action IS 'Action performed (e.g., create_user, delete_user, create_assignment)';
COMMENT ON COLUMN admin_activity_log.entity_type IS 'Type of entity affected (e.g., user, donor, student, assignment)';
COMMENT ON COLUMN admin_activity_log.entity_id IS 'ID of the affected entity';
COMMENT ON COLUMN admin_activity_log.details IS 'Additional details about the action in JSON format';
