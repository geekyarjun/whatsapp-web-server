var express = require('express');
var router = express.Router();
const userApi = require('../api/Users');
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile', function(req, res) {
  res.send('respond with a resource');
});

router.get('/getUsers', async (req,res) => {
  try {
    const Users = await userApi.getUsers();
    res.send(Users);
  } catch (err) {
      res.send(err);
  }
});

router.post('/isLoggedIn', (req, res, next) => {
  console.log("req.body", req.headers);
  next();
}, passport.authenticate('jwt'), (req, res, next) => {
      console.log('req.user in jwt', req.user);
      next();
    }, (req, res) => {
  try {
    console.log('req.user', req.user, "req.session", req.session);
    if (req.user) {
      const userData = JSON.parse(JSON.stringify(req.user));
      userData.online = true;
      res.send(userData);
    } else {
      res.send({online: false});
    }
  } catch (error) {
    console.log("Error>>>>>>>>>>>>..", error);
  }
});

router.get('/logout', (req, res) => {
  console.log('req.user>>>>>', req.user, req.session);
  // req.logout();
  console.log('req.user>>>>>', req.user, req.session);
  // UserApi.disconnect(global.userId);
  // global.userId = '';
  // req.session= null;
  res.send({
    success: true
  });
  // res.writeHead(301, {Location: 'http://127.0.0.1:3000'});
  // res.end();
  // res.status(301).redirect('http://127.0.0.1:3000');
});

module.exports = router;

