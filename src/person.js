/* eslint-disable no-multi-str */
const AWS = require('aws-sdk');
const pool = require('../db');
// const { s3key } = require('../config');

AWS.config.update({
  // Your SECRET ACCESS KEY from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
  secretAccessKey: 'LXUL/eart5wnf8rU6GEy7XUBhy8zHxxqROrM/LLA',
  // Not working key, Your ACCESS KEY ID from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
  accessKeyId: 'AKIAIZINNYGGMORPNW7Q',
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
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
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
      if (err) {
        console.log(err);
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
    console.log(req.body);
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
      console.log(err, data);
      if (err) {
        res.send(err);
      }
      if (!err) {
        res.send(data);
      }
    });
  }
};
