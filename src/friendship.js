/* eslint-disable no-multi-str */
const pool = require('../db');

module.exports = {
  updateFriends: (req, res) => {
    // assume req.body contains id1, id2, and option
    const values = [];
    const { id1, id2, option, actionTaker } = req.body;
    if (id1 > id2) {
      values.push(id2);
      values.push(id1);
      values.push(option);
      values.push(actionTaker);
    } else {
      values.push(id1);
      values.push(id2);
      values.push(option);
      values.push(actionTaker);
    }
    const query = {
      name: 'update-friends',
      text:
        'INSERT INTO friendships\
            (person_one, person_two, friend_status, action_taker)\
            VALUES ($1, $2, $3, $4)',
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
  },
  getFriends: (req, res) => {
    const { id } = req.query;
    const query = {
      name: 'get-friends',
      text:
        'SELECT * FROM friendships\
        INNER JOIN person ON person.person_id = friendships.person_one OR person.person_id = friendships.person_two\
        WHERE friendships.person_one = ($1) OR friendships.person_two = ($1);',
      values: [id]
    };
    pool.query(query, (err, result) => {
      if (!err && result.rows) {
        const friendsList = result.rows.filter(row => row.person_id !== parseInt(id, 10));
        res.send(friendsList);
      }
      if (err) {
        console.log(err);
        res.send(err);
      }
    });
  }
};
