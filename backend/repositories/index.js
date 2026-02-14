/**
 * Repository Index
 * Exports all repositories for easy importing
 */

const database = require('../config/database');
const UserRepository = require('./UserRepository');
const AdminActivityRepository = require('./AdminActivityRepository');

// Initialize repositories with database instance
const repositories = {
    users: new UserRepository(database),
    adminActivity: new AdminActivityRepository(database)
};

module.exports = repositories;
