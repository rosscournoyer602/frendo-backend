/* eslint-disable no-multi-str */
const AWS = require('aws-sdk');
const pool = require('../db');
const { s3key, s3keyID } = require('../config');

AWS.config.update({
  // Your SECRET ACCESS KEY from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
  secretAccessKey: s3key,
  // Not working key, Your ACCESS KEY ID from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
  accessKeyId: s3keyID,
  region: 'ap-northeast-1' // region of your bucket
});

const s3 = new AWS.S3();

module.exports = {
  addPerson: (req, res) => {
    const query = {
      name: 'add-person',
      text:
        'INSERT INTO person\
            (first_name, last_name, dob, street_address, city, state_province, phone, email)\
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)\
            RETURNING first_name, last_name, dob, street_address, city, state_province, phone, avatar_url, email',
      values: [
        req.body.first_name,
        req.body.last_name,
        req.body.dob,
        req.body.street_address,
        req.body.city,
        req.body.state_province,
        req.body.phone,
        req.body.email
      ]
    };
    pool.query(query, (err, result) => {
      if (err && err.code === '23505') {
        console.log(err);
        const updateQuery = {
          name: 'update-person',
          text:
            'UPDATE person\
            SET (first_name, last_name, dob, street_address, city, state_province, phone) = ($1, $2, $3, $4, $5, $6, $7)\
            WHERE email = ($8)\
            RETURNING first_name, last_name, dob, street_address, city, state_province, phone, avatar_url, email',
          values: [
            req.body.first_name,
            req.body.last_name,
            req.body.dob,
            req.body.street_address,
            req.body.city,
            req.body.state_province,
            req.body.phone,
            req.body.email
          ]
        };
        pool.query(updateQuery, (updateErr, updateResult) => {
          if (updateErr) {
            console.log(updateErr);
          }
          if (!updateErr) {
            res.send(updateResult);
          }
        });
      }
      // TODO - Better error handling
      if (!err) {
        res.send(result);
      }
    });
  },
  getPerson: (req, res) => {
    const query = {
      name: 'get-person',
      text: 'SELECT * \
             FROM person \
             WHERE email = ($1);',
      values: [req.query.email]
    };

    pool.query(query, (err, result) => {
      if (err) {
        console.log(err);
        // res.send(err);
      }
      // TODO - Better error handling
      if (!err) {
        res.send(result);
      }
    });
  },
  updateAvatar: (req, res) => {
    const type = req.body.data.split(';')[0].split('/')[1];
    const buffer = Buffer.from(req.body.data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const params = {
      Bucket: 'friendo2',
      Key: `${req.body.user}.${type}`,
      Body: buffer,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: `image/${type}`
    };
    s3.upload(params, (err, data) => {
      if (err) {
        res.send(err);
      }
      if (!err) {
        // res.send(data);
        const updateQuery = {
          name: 'update-avatar',
          text: `UPDATE person\
            SET avatar_url = ($1)\
            WHERE email = ($2)`,
          values: [data.key, req.body.user]
        };
        pool.query(updateQuery, (updateErr, result) => {
          if (updateErr) {
            console.log(updateErr);
          }
          if (!err) {
            res.send(result);
          }
        });
      }
    });
  }
};
