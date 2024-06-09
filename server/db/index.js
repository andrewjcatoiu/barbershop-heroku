const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'barbershop',
    password: '39440708',
    port: 5432
});

module.exports = {
    query: (text, params, callback) => pool.query(text, params, callback)
};