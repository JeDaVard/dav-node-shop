const app = require('./app');

const port = process.env.PORT || 3000;

const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'dav-node-shop',
    password: `asdfghjkl;'`,
});

db = pool
    .promise()
    .execute('SELECT * FROM products')
    .then((r) => console.log(r[0], r[1]))
    .catch((e) => console.log(e));

app.listen(port, () => {
    console.log(`Server is up on ${port}`);
});
