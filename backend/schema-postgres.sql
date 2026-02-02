-- PostgreSQL Schema for Obayi Education Foundation
-- Migration from SQLite to Azure PostgreSQL Flexible Server
-- Created: 2025-01-30

-- Enable UUID extension (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (base table for all user types)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('donor', 'student', 'admin')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);

-- Donors table (extends users)
CREATE TABLE IF NOT EXISTS donors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    donation_amount DECIMAL(10,2),
    donation_frequency VARCHAR(20) CHECK (donation_frequency IN ('one-time', 'monthly', 'quarterly', 'yearly')),
    preferred_contact VARCHAR(20) CHECK (preferred_contact IN ('email', 'phone', 'both')),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for joins
CREATE INDEX IF NOT EXISTS idx_donors_user_id ON donors(user_id);

-- Students table (extends users)
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) UNIQUE, -- Custom student ID
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    school_name VARCHAR(255),
    grade_level VARCHAR(50),
    field_of_study VARCHAR(100),
    profile_picture_url TEXT, -- Azure Blob Storage URL
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    guardian_email VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);

-- Many-to-many relationship between donors and students
CREATE TABLE IF NOT EXISTS donor_student_assignments (
    id SERIAL PRIMARY KEY,
    donor_id INTEGER NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    assigned_by_admin_id INTEGER NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    UNIQUE(donor_id, student_id)
);

-- Create indexes for assignments
CREATE INDEX IF NOT EXISTS idx_donor_student_assignments_donor_id ON donor_student_assignments(donor_id);
CREATE INDEX IF NOT EXISTS idx_donor_student_assignments_student_id ON donor_student_assignments(student_id);

-- Student documents (results, receipts, certificates)
CREATE TABLE IF NOT EXISTS student_documents (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('school_result', 'receipt', 'primary_certificate', 'secondary_certificate', 'university_certificate', 'other', 'certificate')),
    document_title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    file_url TEXT NOT NULL, -- Azure Blob Storage URL
    blob_name VARCHAR(255) NOT NULL, -- Azure blob identifier for deletion
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    amount DECIMAL(10,2) -- For receipts
);

-- Create index for document queries
CREATE INDEX IF NOT EXISTS idx_student_documents_student_id ON student_documents(student_id);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for token lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donors_updated_at
    BEFORE UPDATE ON donors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123 - MUST BE CHANGED IN PRODUCTION)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (email, password_hash, user_type, first_name, last_name)
VALUES ('admin@obayi.co', '$2a$10$PL0tMi5zjvgzNsBOH36fG.miKfI1onfU.sHsq7Rr85pS0PbxpHxXS', 'admin', 'Admin', 'User')
ON CONFLICT (email) DO NOTHING;

-- Grant permissions (adjust as needed for your Azure PostgreSQL user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_azure_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_azure_user;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'PostgreSQL schema created successfully!';
    RAISE NOTICE 'Default admin account: admin@obayi.co / admin123';
    RAISE NOTICE 'IMPORTANT: Change the admin password immediately after first login!';
END $$;
