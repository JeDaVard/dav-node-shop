const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'dav-node-shop',
    password: `asdfghjkl;'`,
});

const db = pool.promise();

module.exports = db