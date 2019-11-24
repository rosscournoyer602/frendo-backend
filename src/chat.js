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
      const firstMessage = "You've added a new friend. Start chatting";
      const firstMessageValues = [addNewChatResult.rows[0].chat_id, firstMessage];
      const firstMessageQuery = {
        name: 'add-first-message',
        text: 'INSERT INTO messages\
        (chat_id, content)\
        VALUES ($1, $2)',
        values: firstMessageValues
      };
      try {
        pool.query(firstMessageQuery);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  }
};
