/* eslint-disable no-console */
const passport = require('passport');
// eslint-disable-next-line no-unused-vars
const passportService = require('./passport');
const { signup, signin } = require('./auth');
const { addPerson, getPerson, updateAvatar, findPerson } = require('./person');
const { updateFriends, getFriends } = require('./friendship');
const { getChat } = require('./chat');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = app => {
  app.get('/', (req, res) => {
    res.status(200).send('Hello There!');
  });

  app.get('/person', requireAuth, getPerson);

  app.post('/addperson', requireAuth, addPerson);

  app.post('/signup', signup);

  app.post('/signin', requireSignin, signin);

  app.put('/avatar', requireAuth, updateAvatar);

  app.put('/friendupdate', requireAuth, updateFriends);

  app.get('/friends', requireAuth, getFriends);

  app.get('/search', requireAuth, findPerson);

  app.get('/getchat', requireAuth, getChat);
};
