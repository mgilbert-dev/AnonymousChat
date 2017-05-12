const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const RockPaperScissors = require('./addons/RockPaperScissors.js');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

let users = {

};

let plugins = {
  rockPaperScissors: new RockPaperScissors(users, io)
};

io.on('connection', function(socket) {

  socket.on('user connected', function(payload) {
    users[payload.user.id] = {
      name: payload.user.name,
      socketId: socket.id,
      color: payload.user.color,
      lockedOut: false,
      id: payload.user.id
    };
    io.emit('update users', {
      users: users,
      message: `${payload.user.name} connected`,
      styling: {
        color: payload.user.color
      },
      broadcast: true
    });
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
    io.emit('update users', {
      users: users,
      message: `${userName} disconnected`,
      styling: {
        color: 'white'
      },
      broadcast: true
    });
  });

  socket.on('chat message', function(payload) {
    if (payload.message.startsWith('/')) {
      handleCommand(payload);
    }
    else if (payload.message !== '') {
      io.emit('chat message', {
        message: users[payload.user.id].name + ': ' + payload.message,
        styling: {
          color: payload.user.color
        },
        broadcast: true
      });
    }
  });

  socket.on('user typing', function(payload) {
    
    if (payload.key === '/') {
      users[payload.user.id].lockedOut = true;
      setTimeout(() => {
        users[payload.user.id].lockedOut = false;
      },5000);
    } else if (users[payload.user.id] && !users[payload.user.id].lockedOut) {
      io.emit('user typing', {
        user: payload.user,
        message: `${payload.user.name} is typing...`,
        styling: {
          color: 'white'
        }
      });
    }
  });

  socket.on('user stop typing', function(payload) {
    io.emit('user stop typing', {
      user: payload.user
    });
  });
});

http.listen(process.env.PORT || 5000, function() {
  console.log('listening on *:' + (process.env.PORT || 5000));
});

function handleCommand(payload) {
  let operation = payload.message.split(' ')[0];
  let argument = payload.message.split(' ')[1];
  users[payload.user.id].lockedOut = false;

  switch (operation) {

    case '/name':
      let previousName = users[payload.user.id].name;
      users[payload.user.id].name = argument;
      io.emit('update users', {
        users: users,
        message: `${previousName} changed their name to ${argument}.`,
        styling: {
          color: payload.user.color
        },
        broadcast: true
      });
      break;

    case '/color':
      users[payload.user.id].color = argument;
      io.emit('update users', {
        users: users,
        message: `${users[payload.user.id].name} changed their color to ${argument}.`,
        styling: {
          color: argument
        },
        broadcast: true
      });
      break;

    case '/whisper':
      if (payload.message.indexOf(payload.message.split(' ')[2]) > 0) {
        let targetUsers = Object.keys(users).filter(el => {
          return users[el].name === argument;
        });
        let sender = users[payload.user.id].name;
        let message = payload.message.substr(payload.message.indexOf(payload.message.split(' ')[2]));
        io.emit('whisper', {
          message: sender + ' > ' + argument + ': ' + message,
          user: payload.user,
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
        user: payload.user,
        styling: {
          color: 'white'
        }
      });
      break;

    case '/rps':
      plugins.rockPaperScissors.takeCommand(payload.user, argument);
      break;

    case '/commands':
      io.emit('list commands', {
        commands: ['\'/name [name]\' - change your name.', '\'/color [color]\' - change your font color.', '\'/users\' - List users in room.', '\'/whisper [name] [message]\' - Directly message everyone with that name.','\'/rps [number]\' - Initiates a game of \'Rock, Paper, Scissors\' with [number] open spots.', '\'/rps [action]\' - If a game has started, declare your action with \'rock\',\'paper\',\'scissors\',\'r\',\'p\', or \'s\'.'],
        user: payload.user,
        styling: {
          marginLeft: '10px'
        }
      });
      break;
    default:
  }
}

function emitWarning(message, user) {
  io.emit('warning', {
    warning: message,
    user: user
  });
}
