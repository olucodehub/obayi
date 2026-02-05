/**
 * SQL Helper Utilities
 * Converts SQLite-style queries to PostgreSQL-compatible format
 */

/**
 * Convert SQLite-style ? placeholders to PostgreSQL $1, $2, $3 format
 * @param {string} sql - SQL query with ? placeholders
 * @returns {string} - SQL query with $1, $2, $3 placeholders
 */
function convertToPostgres(sql) {
    let index = 1;
    // Replace ? with $1, $2, $3, etc.
    const converted = sql.replace(/\?/g, () => `$${index++}`);

    // Replace SQLite datetime functions with PostgreSQL equivalents
    return converted
        .replace(/datetime\('now'\)/gi, 'CURRENT_TIMESTAMP')
        .replace(/datetime\("now"\)/gi, 'CURRENT_TIMESTAMP');
}

/**
 * Build UPDATE query with dynamic fields for PostgreSQL
 * @param {string} table - Table name
 * @param {Object} fields - Object with field names and values
 * @param {string} whereClause - WHERE clause (e.g., "id = $1")
 * @param {number} startIndex - Starting parameter index (default: 1)
 * @returns {Object} - { query, params }
 */
function buildUpdateQuery(table, fields, whereClause, startIndex = 1) {
    const keys = Object.keys(fields);
    if (keys.length === 0) {
        return null;
    }

    const setClause = keys
        .map((key, i) => `${key} = $${startIndex + i}`)
        .join(', ');

    const query = `UPDATE ${table} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE ${whereClause}`;
    const params = Object.values(fields);

    return { query, params };
}

module.exports = {
    convertToPostgres,
    buildUpdateQuery
};
