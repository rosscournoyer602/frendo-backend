const bcrypt = require('bcrypt-nodejs');
const pool = require('../db');
const passport = require('passport');

module.exports = {
	signup: (req, res) => {
		pool.connect().then(client => {
			const queryText = 'SELECT EXISTS (SELECT true FROM auth_user WHERE email=$1);'
			const checkEmailParam = [req.body.email];

			client.query(queryText, checkEmailParam).then(result => {
				// console.log(result.rows[0].exists);
				if (result.rows[0].exists === true) {
					res.status(403).send(`User ${req.body.email} already exists, please sign in.`);
				} 

				bcrypt.genSalt(10, function(err, salt) {
					if (err) console.log(err);
					
					bcrypt.hash(req.body.password, salt, null, function(err, hash) {
						if (err) console.log(err);

						const addPersonQuery = 'INSERT INTO auth_user (email, password_hash) VALUES ($1, $2)';
						const addUserParams = [req.body.email, hash]
						client.query(addPersonQuery, addUserParams).then(() => {
							res.status(200).send('User account successfully created.');
							client.release();
						})
						.catch(err => {
							res.send(`Encountered unknown error: ${err}`);
							client.release();
						});
					});
				});
		})
		.catch(err => {
			res.send(`Encountered unknown error: ${err}`);
			client.release();
		});
	})
	.catch(err => {
		res.send(`Encountered unknown error: ${err}`);
		client.release();
	});
	},
	signin: () => {
		// check if there is already a user with that email
		// if not return err/not authed
		// if yes, return token
		// return authed
	}
};