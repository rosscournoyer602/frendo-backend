const bcrypt = require('bcrypt-nodejs');
const pool = require('../db');
const passport = require('passport');

module.exports = {
	signup: (req, res) => {
		pool.connect().then(client => {
			const queryText = 'SELECT EXISTS (SELECT true FROM auth_user WHERE email=$1);'
			const queryParams = [req.body.email];

			client.query(queryText, queryParams).then(result => {
				client.release();
				console.log(result);
		})
		.catch(error => {
			client.release();
			console.log(error);
		});
	});
		// if yes, return error/not authed
		// if not, hash the password and create new entry with hashed password
		// give user a token
		// return authed
	},
	signin: () => {
		// check if there is already a user with that email
		// if not return err/not authed
		// if yes, return token
		// return authed
	}
};