const User = require('../models/User');

module.exports = {
    getUsers : () => {
        return new Promise((res, rej) => {
            User.find({}, function(err, result) {
                if (err) {
                    console.log("err",err);
                    rej(err);
                } else {
                    res(result);
                }
            });
        });
    },
    disconnect : (Id) => {
        return new Promise((res, rej) => {
            User.findOneAndUpdate({_id: Id},{$set: {lastSeen: new Date()}},{new: true}, function(err, result) {
                if (err) {
                    console.log("err",err);
                    rej(err);
                } else {
                    console.log('data after disconnection==========',result);
                    const user = JSON.parse(JSON.stringify(result));
                    user.online = false;
                    global.io.emit('userDisconnected', user);
                }
            });
        });
    },
}