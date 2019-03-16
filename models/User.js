const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');

const userSchema = new Schema({
  googleId: { type: String },
  username: { type: String },
  email: { type: String, unique: true },
  contact_number: { type: Number, default: null },
  image: { type: String, default: null },
  lastSeen: {type: Date}
}, {
  versionKey: false
});

userSchema.methods.generateAccessToken = function (user) {
    return new Promise((resolve, reject) => {
        jwt.sign(user.toJSON(), secretKey, {
            expiresIn: '1d'
        }, (error, token) => {
            if (token) resolve(token);
            else reject(error);
        });
    })
}

module.exports = mongoose.model('User', userSchema);
