const googleAuthController = (req, res) => {
    // res.write('<script>window.close();</script>');
    const userData = JSON.parse(JSON.stringify(req.user));
    userData.online = true;
    // req.session.userData = userData;
    console.log('req.session.', req.session);
    console.log('req.session.socketid', req.session.socketId);
    // console.log('global.socketId', global.socketId, userData);
    global.io.to(req.session.socketId).emit('userLoggedIn', userData);
    // res.redirect('http://localhost:3000');
}

module.exports = {
    googleAuthController
}