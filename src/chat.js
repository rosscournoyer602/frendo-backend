/* eslint-disable no-multi-str */
const pool = require('../db');

module.exports = {
  addChat: async id => {
    const startChatValues = [id];
    const startChatQuery = {
      name: 'add-new-chat',
      text:
        'INSERT INTO chats\
        (friendship_id)\
        VALUES ($1)\
        RETURNING chat_id',
      values: startChatValues
    };
    try {
      const addNewChatResult = await pool.query(startChatQuery);
      const firstMessageValues = [addNewChatResult.rows[0].chat_id];
      console.log('FIRST MESSAGE VALUES', firstMessageValues);
    } catch (err) {
      console.log(err);
    }
  }
};
