const { Pool } = require('pg');
const { user, host, database, password, port} = require('./secrets/db_config');

const pool = new Pool({ user, host, database, password, port });

//this is if you need to run multiple queries, which we dont

// pool.connect((err, client, release ) => {
//     if (err) return console.log(err);
//     console.log('pool.connect happened');
//     client.query('SELECT * FROM person', (err, result) => {
//         release();
//         if (err) {
//             return console.log(err);
//         }
//         console.log(result);
//     })
// });

//we just need the first available client, so we call straight from pool
// pool.query('SELECT * FROM person', (err, result) => {
//     if (err) return console.log(err);
//     console.log(result);
// });

module.exports = pool;