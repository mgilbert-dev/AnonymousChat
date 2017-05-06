require('newrelic');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var users = {

};

io.on('connection', function(socket) {

  socket.on('user connected', function(userId) {
    users[userId] = {
      name: 'Anonymous-user',
      socketId: socket.id,
      color: 'black',
      lockedOut: false
    };
    io.emit('user connected', users);
  });

  socket.on('disconnect', function(){
    let userName;
    let userId;
    for (let user in users) {
      if (users.hasOwnProperty(user)) {
        if (users[user].socketId === socket.id) {
          userName = users[user].name;
          userId = user;
          delete users[user];
        }
      }
    }
    io.emit('user disconnected', {
      name: userName,
      user: userId
    });
  });

  socket.on('chat message', function(payload) {
    if (payload.message.startsWith('/')) {
      handleCommand(payload);
    }
    else if (payload.message !== '') {
      io.emit('chat message', {
        message: users[payload.id].name + ' says: ' + payload.message,
        color: users[payload.id].color
      });
    }
  });

  socket.on('user typing', function(payload) {
    if (payload.key === '/') {
      users[payload.id].lockedOut = true;
      setTimeout(() => {
        users[payload.id].lockedOut = false;
      },5000);
    } else if (users[payload.id] && !users[payload.id].lockedOut) {
      io.emit('user typing', payload);
    }
  });

  socket.on('user stop typing', function(msg) {
    io.emit('user stop typing', msg);
  });
});

http.listen(process.env.PORT || 5000, function() {
  console.log('listening on *:' + (process.env.PORT || 5000));
});

function handleCommand(payload) {
  let operation = payload.message.split(' ')[0];
  let argument = payload.message.split(' ')[1];
  users[payload.id].lockedOut = false;
  switch (operation) {
    case '/name':
      var previousName = users[payload.id].name;
      users[payload.id].name = argument;
      io.emit('set name', {
        message: previousName + ' changed their name to ' + argument + '.',
        users: users
      });
      break;
    
    case '/color':
      users[payload.id].color = argument;
      io.emit('set color', {
        message: 'You changed your color to ' + argument + '.',
        id: payload.id
      });
      break;

    case '/whisper':
      if (payload.message.indexOf(payload.message.split(' ')[2]) > 0) {
        let targetUsers = Object.keys(users).filter(el => {
          return users[el].name === argument;
        });
        let sender = users[payload.id].name;
        let message = payload.message.substr(payload.message.indexOf(payload.message.split(' ')[2]));
        console.log(message);
        io.emit('whisper', {
          message: sender + ' > ' + argument + ': ' + message,
          id: payload.id,
          targetUsers: targetUsers
        });
      }
      
      break;

    case '/users':
      let userList = Object.keys(users).map( (el,idx) => {
        if (idx < Object.keys(users).length - 1) {
          return users[el].name + ',';
        }
        else {
          return users[el].name + '.';
        }
      }).join(' ');
      io.emit('list users', {
        message: 'Users in room: ' + userList,
        id: payload.id
      });
      break;

    case '/commands':
      io.emit('list commands', {
        message: "Commands: /name <name> - change your name. /color <color> - change your font color. /users - List users in room. /whisper <name> <message> - Directly message everyone with that name.",
        id: payload.id
      });
      break;
    default:
  }
}
