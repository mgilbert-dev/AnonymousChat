const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const RockPaperScissors = require('./plugins/RockPaperScissors.js');
// const Cards = require('./plugins/cards.js');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

let users = {

};

const reply = (payload) => {
  if (payload.message) {
    if (!payload.styling) {
      payload.styling = {color: 'white'};
    }
    io.emit('plugin', payload);
  }
  else {
    throw "Payload must at least contain a message";
  }
};

const allCommands = (basicCommands) => {
  Object.keys(plugins).forEach(plugin => {
    basicCommands = basicCommands.concat(plugins[plugin].availableCommands);
  });
  return basicCommands;
};

let basicCommands = [
  '\'/name [name]\' - change your name.', 
  '\'/color [color]\' - change your font color.', 
  '\'/users\' - List users in room.', 
  '\'/whisper [name] [message]\' - Directly message everyone with that name.'
];

/* PLUGIN CONTRACT
  Integration: Add plugin to plugins object as follows:

    [key]: {
      availableCommands: ['\'/key [command]\' - [what happens]', etc],
      plugin: new Plugin((payload) => reply(key, payload))
    }
    
    Replace each occurrence of 'key' with a shorthand for your plugin, and anything inside square brackets with anything you want (not to confuse with the outer square brackets, indicating an array)
    Replace 'Plugin' with the plugin class

  Initialization: Initialized with a function that takes a payload and sends it to the channel.
    Payload schema: { message: required String, styling: optional Object, user: optional Object, broadcast: optional Boolean }
      payload.styling must follow jQuery syntax ({camelCase: 'string'})
      payload.user is used to filter the message to a specific user
      payload.broadcast bypasses the above and displays the message to the channel

  Receiving inputs: Commands will be issued through a class method Plugin.receiveCommand(user, command).
    The first argument will be a user object with the following: {name: String, id: String, color: String, lockedOut: Boolean, socketId: String}
    The second argument will be an array of commands, space delimited. E.g., the command '/plugin start game for 5 players' would yield an array of ['start', 'game', 'for', '5', 'players']
*/

const plugins = {
  rps: {
    availableCommands: [
      '\'/rps [number]\' - Initiates a game of \'Rock, Paper, Scissors\' with [number] open spots.', 
      '\'/rps [action]\' - If a game has started, declare your action with \'rock\',\'paper\',\'scissors\',\'r\',\'p\', or \'s\'.'
    ],
    plugin: new RockPaperScissors((payload) => reply(payload))
  },
  // cards: {
  //   availableCommands: [
  //     '\'/cards --help all\' - Display all available commands for Cards.'
  //   ],
  //   plugin: new Cards((payload) => reply(payload))
  // }
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
    guaranteeUserMatch(payload.user);

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
    guaranteeUserMatch(payload.user);

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
  let args = payload.message.substring(operation.length + 1).split(' ');
  users[payload.user.id].lockedOut = false;

  switch (operation) {

    case '/name':
      let previousName = users[payload.user.id].name;
      users[payload.user.id].name = args[0];
      io.emit('update users', {
        users: users,
        message: `${previousName} changed their name to ${args.join(' ')}.`,
        styling: {
          color: payload.user.color
        },
        broadcast: true
      });
      break;

    case '/color':
      users[payload.user.id].color = args[0];
      io.emit('update users', {
        users: users,
        message: `${users[payload.user.id].name} changed their color to ${args[0]}.`,
        styling: {
          color: args[0]
        },
        broadcast: true
      });
      break;

    case '/whisper':
      if (payload.message.indexOf(payload.message.split(' ')[2]) > 0) {
        let targetUsers = Object.keys(users).filter(el => {
          return users[el].name === args[0];
        });
        let sender = users[payload.user.id].name;
        let message = args.slice(1).join(' ');
        io.emit('whisper', {
          message: sender + ' > ' + args[0] + ': ' + message,
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

    case '/commands':
      io.emit('list commands', {
        commands: allCommands(basicCommands),
        user: payload.user,
        styling: {
          marginLeft: '10px'
        }
      });
      break;
    default:
      for (let plugin in plugins) {
        if (plugins.hasOwnProperty(plugin)) {
          if (operation.substring(1) === plugin) {
            plugins[plugin].plugin.receiveCommand(payload.user, args);
            return false;
          }
        }
      }
  }
}

function emitWarning(message, user) {
  io.emit('warning', {
    warning: message,
    user: user
  });
}

function guaranteeUserMatch(user) {
  if (!users[user.id]) {
    users[user.id] = user;
  }
}
