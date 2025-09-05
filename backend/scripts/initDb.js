const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const schemaPath = path.join(__dirname, '..', 'schema.sql');

// Create database directory if it doesn't exist
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Read schema file
const schema = fs.readFileSync(schemaPath, 'utf8');

// Create database and run schema
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database');
});

// Execute schema
db.exec(schema, (err) => {
    if (err) {
        console.error('Error creating schema:', err.message);
        process.exit(1);
    }
    console.log('Database schema created successfully');
    
    // Close database
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        }
        console.log('Database initialized successfully!');
        console.log('Database file created at:', dbPath);
        process.exit(0);
    });
});