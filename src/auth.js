const bcrypt = require('bcrypt-nodejs');
const pool = require('../db');
const passport = require('passport');

module.exports = {
	signup: (req, res) => {
		pool.connect().then(client => {

			bcrypt.genSalt(10, function(err, salt) {			
				bcrypt.hash(req.body.password, salt, null, function(err, hash) {

					const addPersonQuery = 'INSERT INTO auth_user (email, password_hash) VALUES ($1, $2)';
					const addUserParams = [req.body.email, hash]
					client.query(addPersonQuery, addUserParams).then(result => {
						res.status(200).send(result);
						client.release();
					})
					.catch(err => {
						res.status(403).send(err.detail);
						client.release();
					});
				});
			});
		})
		.catch(err => {
			res.send(`Encountered unknown error: ${err}`);
			client.release();
		});
	},
	signin: (req, res) => {
		pool.connect().then(client => {

			const getPersonQuery = 'SELECT * FROM auth_user WHERE email = ($1)';
			const getPersonParams = [req.body.email];
			client.query(getPersonQuery, getPersonParams).then(result => {
				bcrypt.compare(req.body.password, result.rows[0].password_hash, function(err, compare) {
					if (compare === true) {
						res.status(200).send('Logged in');
						client.release();
					}
					if (compare === false) {
						res.status(403).send('Password Incorrect');
						client.release();
					}
				});
			})
			.catch(err => {
				res.status(403).send(err);
				client.release();
			});
		})
		.catch(err => {
			res.send(`Encountered unknown error: ${err}`);
			client.release();
		});
	}
};