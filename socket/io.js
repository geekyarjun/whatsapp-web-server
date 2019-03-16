const sockets = require('socket.io');
const UserApi = require('../api/Users');
let io;

const connection = (server) => {
  global.onlineUsers = [];
  io = sockets(server);
  io.on('connection', (socket) => {
    socket.on('connectionFromClientOnLoggedIn', (userData) => {
      global.onlineUsers.push({socketId: socket.id, user:userData});
      io.emit('connectedUsersData', global.onlineUsers);
    })

    socket.on('disconnect', () => {
      console.log('disconnect from the server...........////////');
      console.log("currently users in global variable", global.onlineUsers);
      if (global.onlineUsers.length) {
        const index = global.onlineUsers.findIndex(user => user.socketId === socket.id);
        if (index >= 0) {
          UserApi.disconnect(global.onlineUsers[index].user._id);
          global.onlineUsers.splice(index, 1);
        }
      }
    })
  });
  global.io = io;
  // console.log('io', global.io);
};

module.exports = connection;
