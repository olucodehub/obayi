// Use sqlite3 for production compatibility (no native compilation required)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'database.sqlite');

class DatabaseWrapper {
    constructor() {
        this.db = null;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            try {
                this.db = new sqlite3.Database(dbPath, (err) => {
                    if (err) {
                        console.error('Error connecting to database:', err.message);
                        reject(err);
                    } else {
                        console.log('Connected to SQLite database');
                        
                        // Enable foreign keys and optimize settings
                        this.db.run('PRAGMA foreign_keys = ON');
                        this.db.run('PRAGMA journal_mode = WAL');
                        this.db.run('PRAGMA synchronous = NORMAL');
                        this.db.run('PRAGMA cache_size = 1000');
                        this.db.run('PRAGMA temp_store = MEMORY');
                        
                        resolve(this.db);
                    }
                });
            } catch (error) {
                console.error('Error connecting to database:', error.message);
                reject(error);
            }
        });
    }

    getDb() {
        return this.db;
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }

    // sqlite3 methods are async
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ 
                        id: this.lastID, 
                        changes: this.changes 
                    });
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

const database = new DatabaseWrapper();

module.exports = database;