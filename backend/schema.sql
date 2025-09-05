-- Users table (base table for all user types)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('donor', 'student', 'admin')),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Donors table (extends users)
CREATE TABLE IF NOT EXISTS donors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    donation_amount DECIMAL(10,2),
    donation_frequency TEXT CHECK (donation_frequency IN ('one-time', 'monthly', 'quarterly', 'yearly')),
    preferred_contact TEXT CHECK (preferred_contact IN ('email', 'phone', 'both')),
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Students table (extends users)  
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id TEXT UNIQUE, -- Custom student ID
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    city TEXT,
    country TEXT,
    school_name TEXT,
    grade_level TEXT,
    field_of_study TEXT,
    profile_picture_url TEXT, -- Azure Blob Storage URL
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    guardian_name TEXT,
    guardian_phone TEXT,
    guardian_email TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many relationship between donors and students
CREATE TABLE IF NOT EXISTS donor_student_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    assigned_by_admin_id INTEGER NOT NULL REFERENCES users(id),
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    UNIQUE(donor_id, student_id)
);

-- Student documents (results, receipts, certificates)
CREATE TABLE IF NOT EXISTS student_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('school_result', 'receipt', 'primary_certificate', 'secondary_certificate', 'university_certificate', 'other', 'certificate')),
    document_title TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    file_url TEXT NOT NULL, -- Azure Blob Storage URL
    blob_name TEXT NOT NULL, -- Azure blob identifier for deletion
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    amount DECIMAL(10,2) -- For receipts
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_donors_user_id ON donors(user_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_student_id ON student_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_donor_student_assignments_donor_id ON donor_student_assignments(donor_id);
CREATE INDEX IF NOT EXISTS idx_donor_student_assignments_student_id ON donor_student_assignments(student_id);

-- Insert default admin user (password: admin123 - should be changed in production)
INSERT OR IGNORE INTO users (email, password_hash, user_type, first_name, last_name) 
VALUES ('admin@obayi.co', '$2a$10$PL0tMi5zjvgzNsBOH36fG.miKfI1onfU.sHsq7Rr85pS0PbxpHxXS', 'admin', 'Admin', 'User');