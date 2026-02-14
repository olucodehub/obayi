/**
 * Base Repository Pattern for Database Access
 * Provides common CRUD operations similar to .NET Entity Framework
 */

class BaseRepository {
    constructor(database, tableName) {
        this.db = database;
        this.tableName = tableName;
    }

    /**
     * Get all records with optional filter
     * @param {Object} filter - WHERE clause filters
     * @param {Object} options - { orderBy, limit, offset }
     */
    async findAll(filter = {}, options = {}) {
        let query = `SELECT * FROM ${this.tableName}`;
        const params = [];
        let paramIndex = 1;

        // Build WHERE clause
        if (Object.keys(filter).length > 0) {
            const conditions = Object.keys(filter).map(key => {
                params.push(filter[key]);
                return `${key} = $${paramIndex++}`;
            });
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        // Add ORDER BY
        if (options.orderBy) {
            query += ` ORDER BY ${options.orderBy}`;
        }

        // Add LIMIT
        if (options.limit) {
            query += ` LIMIT ${options.limit}`;
        }

        // Add OFFSET
        if (options.offset) {
            query += ` OFFSET ${options.offset}`;
        }

        return await this.db.all(query, params);
    }

    /**
     * Get single record by ID
     */
    async findById(id) {
        return await this.db.get(
            `SELECT * FROM ${this.tableName} WHERE id = $1`,
            [id]
        );
    }

    /**
     * Get single record by filter
     */
    async findOne(filter) {
        const params = [];
        let paramIndex = 1;
        const conditions = Object.keys(filter).map(key => {
            params.push(filter[key]);
            return `${key} = $${paramIndex++}`;
        });

        return await this.db.get(
            `SELECT * FROM ${this.tableName} WHERE ${conditions.join(' AND ')}`,
            params
        );
    }

    /**
     * Create new record
     */
    async create(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`);

        const result = await this.db.run(
            `INSERT INTO ${this.tableName} (${keys.join(', ')})
             VALUES (${placeholders.join(', ')})
             RETURNING *`,
            values
        );

        return result;
    }

    /**
     * Update record by ID
     */
    async update(id, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

        values.push(id);

        const result = await this.db.run(
            `UPDATE ${this.tableName}
             SET ${setClause}, updated_at = CURRENT_TIMESTAMP
             WHERE id = $${keys.length + 1}
             RETURNING *`,
            values
        );

        return result;
    }

    /**
     * Delete record by ID (soft delete)
     */
    async softDelete(id) {
        return await this.db.run(
            `UPDATE ${this.tableName}
             SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [id]
        );
    }

    /**
     * Hard delete record by ID
     */
    async delete(id) {
        return await this.db.run(
            `DELETE FROM ${this.tableName} WHERE id = $1`,
            [id]
        );
    }

    /**
     * Count records with optional filter
     */
    async count(filter = {}) {
        let query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
        const params = [];
        let paramIndex = 1;

        if (Object.keys(filter).length > 0) {
            const conditions = Object.keys(filter).map(key => {
                params.push(filter[key]);
                return `${key} = $${paramIndex++}`;
            });
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        const result = await this.db.get(query, params);
        return result.count;
    }

    /**
     * Execute custom query
     */
    async query(sql, params = []) {
        return await this.db.all(sql, params);
    }

    /**
     * Execute custom query returning single result
     */
    async queryOne(sql, params = []) {
        return await this.db.get(sql, params);
    }

    /**
     * Execute custom mutation query
     */
    async execute(sql, params = []) {
        return await this.db.run(sql, params);
    }
}

module.exports = BaseRepository;
