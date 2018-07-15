const { Pool } = require('pg');
const { user, host, database, password, port};

const pool = new Pool({ user, host, database, password, port });

pool.query('SELECT * FROM person', (err, res) => {
    if (err) return console.log(err);

    console.log(res.rows);
});