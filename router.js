const pool = require('./db')

module.exports = function(app) {
    app.get('/', (req, res) => {res.status(200).send('Hello There!')});
    app.get('/people', (req, res) => { 
        pool.query('SELECT * FROM person', (err, result) => {
            if (err) return console.log(err);
            res.status(200).send(result);
        });
    });
};