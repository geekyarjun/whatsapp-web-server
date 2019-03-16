const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { secretKey } = require('../config');
const User = require('../models/User');

const googleStratOpts = {
    clientID: '68770860174-1p44n51vfiabn7cha76pbphg8uhh287q.apps.googleusercontent.com',
    clientSecret: 'LbXcqzz-xsFvTiCh5dcMGuId',
    callbackURL: 'http://localhost:3001/auth/google/callback',
};

const optForJwtAuthStrategy = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey
};

try {
    passport.serializeUser((user, done) => {
        console.log("user in serialize", user);
        global.userId= user._id;
        done(null, user._id);
    });
    
    passport.deserializeUser((userId, done) => {
        console.log("user in deserialize", userId);
        global.userId= userId;
        User.findById(userId)
        .then(user => done(null, user))
        .catch(error => done(error, null));
    });
} catch (error) {
    console.log("Error in serializedf", error);
}

// JWT strategy, to verify token
passport.use(new JwtStrategy(optForJwtAuthStrategy, (payload, done) => {
    if (payload._id) {
        User.findById(payload._id)
            .then(user => {
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            })
            .catch(error => done(error, false))
    }
}))

// Google Strategy, to authenticate user
passport.use(new GoogleStrategy(googleStratOpts, (accessToken, refreshToken, profile, done) => {
    const data = {
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        image: profile.photos[0].value.replace('sz=50', 'sz=100'),
    };
    try {
        User.findOne({ email: data.email }, async (error, user) => {
            if (error) {
                done(error, false);
            } else if (user) {
                const token = await user.generateAccessToken(user);
                const userData = JSON.parse(JSON.stringify(user));
                userData.token = token;
                done(null, userData);
            } else {
                User.create(data, async (error, user) => {
                    if (error) {
                        done(error);
                    } else {
                        const token = await user.generateAccessToken(user);
                        const userData = JSON.parse(JSON.stringify(user));
                        userData.token = token;
                        done(null, userData);
                    }
                });
            }
        });
    } catch (error) {
        console.log("error in passport.config");
    }
}));
