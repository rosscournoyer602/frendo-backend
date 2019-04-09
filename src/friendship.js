/* eslint-disable no-multi-str */
const pool = require('../db');

module.exports = {
  updateFriends: (req, res) => {
    // assume req.body contains id1, id2, and option
    const values = [];
    console.log(req.body);
    const { id1, id2, option } = req.body;
    if (id1 > id2) {
      values.push(id2);
      values.push(id1);
      values.push(option);
    } else {
      values.push(id1);
      values.push(id2);
      values.push(option);
    }
    console.log('VALUES', values);
    const query = {
      name: 'update-friends',
      text:
        'INSERT INTO friendships\
            (person_one, person_two, friend_status)\
            VALUES ($1, $2, $3)',
      values
    };

    pool.query(query, (err, result) => {
      if (!err) {
        res.send(result);
      }

      if (err && err.code === '23505') {
        console.log('ERR CONDITION');
        const updateQuery = {
          name: 'update-existing-friends',
          text:
            'UPDATE friendships\
           SET friend_status = ($3)\
           WHERE (person_one,person_two) = ($1, $2)',
          values
        };
        pool.query(updateQuery, (updateErr, updateResult) => {
          if (!updateErr) {
            res.send(updateResult);
          }
          if (updateErr) {
            res.send(updateErr);
            console.log(updateErr);
          }
        });
      }
    });
  }
};
