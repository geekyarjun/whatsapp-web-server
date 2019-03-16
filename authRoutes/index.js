const express = require('express');
const router = express.Router();
const passport = require('passport');
const { googleAuthController } = require('./authController');
const UserApi = require('../api/Users');
const googleAuthentication = passport.authenticate('google', { scope: ['profile', 'email'],session: false });

router.get('/google', (req, res, next) => {
    console.log("req.query>>>>>>>>>>>>>>>>>>>>>>>>>", req.query);
    // req.socketId = req.query.id;
    // res.locals.sessionId = req.query.id;
    // global.socketId = req.query.id;
    // req.session = {};
    // req.session.passport = {};
    req.session.socketId = req.query.id;
    req.session.save(err => console.log('error in saving session', err));
    console.log("request session >>>>>>>>>>>>>", req.session)
    next();
} , googleAuthentication);

router.get('/google/callback', googleAuthentication, googleAuthController);

/* router.get('/google/isLogin', (req, res)=> {
    console.log('req.user', req.user);
    if(req.user){
        res.send(req.user);
    }else {
        res.send(JSON.stringify('Not Login'));
    }
}); */

module.exports = router;