const pool = require('./db')

module.exports = function(app) {

    app.get('/', (req, res) => {res.status(200).send('Hello There!')});

    // Need route to get specific person
    app.get('/people', (req, res) => { 
        pool.query('SELECT * FROM person', (err, result) => {
            if (err) return console.log(err);
            res.status(200).send(result.rows);
        });
    });
    
    app.post('/addperson', (req, res) => {
        const query = {
            name: 'add-person',
            text: 'INSERT INTO person\
            (first_name, last_name, dob, street_address, city, state, phone, email)\
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            values: [
                req.body.firstName, 
                req.body.lastName, 
                req.body.dob, 
                req.body.streetAddress, 
                req.body.city, 
                req.body.state, 
                req.body.phone, 
                req.body.email
            ]
        };
        pool.query(query, (err, result) => {
            if (err) console.log(err);
            res.status(200).send(result);
        });
    });
};