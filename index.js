const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const RockPaperScissors = require('./plugins/rps/RockPaperScissors.js');
const Cards = require('./plugins/cards/Cards.js');
const Chess = require('./plugins/chess/Chess.js');
const crypto = require('crypto');

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

const render = (payload) => {
  if (payload) {
    io.emit('slide window', payload);
  } else {
    throw "ui must contain a key for  'users', and a key for 'payload'";
  }
};

let basicCommands = [
  '\'/name [name]\' - change your name.', 
  '\'/color [color]\' - change your font color.', 
  '\'/users\' - List users in room.', 
  '\'/whisper [name] [message]\' - Directly message everyone with that name.',
  '\'/save [key1] [key2]...\' - Save user information to local storage. Available keys are \'name\', \'id\', and \'color.\'',
  '\'/delete [key1] [key2]...\' - Delete user information saved on local storage. Available keys are \'name\', \'id\', and \'color.\'',
  '\'/close\' - Close any active windows.',
  '\'/cipher [key]\' - Set a cipher key to encrypt outgoing messages.',
  '\'/decipher [key]\' - Set a decipher key to decrypt incoming messages.',
  '\'/uncipher\' - Remove cipher from outgoing messages.'
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
    The first argument will be a user object with the following: {name: String, id: String, color: String, socketId: String}
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
  cards: {
    availableCommands: [
      '\'/cards --help all\' - Display all available commands for Cards.'
    ],
    plugin: new Cards((payload) => reply(payload), (ui) => render(ui))
  },
  chess: {
    availableCommands: [
      '\'/chess --challenge [gameId]\' - Create an open challenge with id of [gameId]',
      '\'/chess --accept [gameId]\' - Accept a challenge with id [gameId].',
      '\'/chess --resign\' - Resign the current game.',
      '\'/chess -[from] -[to] \' - e.g., \'/chess -e2 -e4\'',
      '\'/chess --reset\' - Reset your current game',
    ],
    plugin: new Chess((payload) => reply(payload), (ui) => render(ui))
  }
};

io.on('connection', function(socket) {
  socket.on('user connected', function(payload) {
    users[payload.user.id] = {
      name: payload.user.name,
      socketId: socket.id,
      color: payload.user.color,
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
    let userName = 'Someone';
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
    if (!guaranteeUserMatch(payload.user)) {
      return false;
    }

    if (payload.message.startsWith('/')) {
      handleCommand(payload);
    }
    else if (payload.message !== '') {
      if (users[payload.user.id].cipher) {
        let cipheredMessage = payload.message.split(' ')
                                .filter(el => el.length < 16)
                                .map(el => {
                                  return cipher(createCipher(users[payload.user.id].cipher), el);
                                })
                                .join(' ');
        io.emit('chat message', {
          message: users[payload.user.id].name + ': (encrypted) ' + cipheredMessage,
          styling: {
            color: payload.user.color
          },
          broadcast: true
        });
        for (let user in users) {
          if (users.hasOwnProperty(user) && users[user].decipher) {
            let decipheredMessage = cipheredMessage.split(' ')
                                      .map(el => {
                                        return decipher(createDecipher(users[user].decipher), el);
                                      })
                                      .join(' ');
            io.emit('cipher', {
              message: `Deciphered: ${decipheredMessage}`,
              user: users[user]
            });
          }
        }
      } else {
        io.emit('chat message', {
          message: users[payload.user.id].name + ': ' + payload.message,
          styling: {
            color: payload.user.color
          },
          broadcast: true
        });
      }
    }
  });

  socket.on('user typing', function(payload) {
    guaranteeUserMatch(payload.user);
    io.emit('user typing', {
      user: payload.user,
      message: `${payload.user.name} is typing...`,
      styling: {
        color: 'white'
      }
    });
  });
});

http.listen(process.env.PORT || 5000, function() {
  console.log('listening on *:' + (process.env.PORT || 5000));
});

function handleCommand(payload) {
  let operation = payload.message.split(' ')[0];
  let args = payload.message.substring(operation.length + 1).split(' ');

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

    case '/save':
      io.emit('save data', {
        keys: args,
        user: payload.user
      });
      break;

    case '/delete':
      io.emit('delete data', {
        keys: args,
        user: payload.user
      });
      break;

    case '/close':
      io.emit('close sliding window', {
        user: payload.user
      });
      break;

    case '/cipher':
      users[payload.user.id].cipher = args[0];
      io.emit('cipher', {
        message: 'Cipher set',
        user: payload.user
      });
      break;

    case '/decipher':
      users[payload.user.id].decipher = args[0];
      io.emit('cipher', {
        message: 'Decipher set',
        user: payload.user
      });
      break;

    case '/uncipher':
      users[payload.user.id].cipher = false;
      io.emit('cipher', {
        message: 'Cipher unset',
        user: payload.user
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
  if (user && !users[user.id]) {
    users[user.id] = user;
  } else if (!user) {
    return false;
  }
  return true;
}

function createCipher(key) {
  return crypto.createCipher('aes192', key);
}

function cipher(userCipher, text) {
  let encrypted = userCipher.update(text);
  encrypted += userCipher.final('hex');
  return encrypted;
}

function createDecipher(key) {
  return crypto.createDecipher('aes192', key);
}

function decipher(userDecipher, encrypted) {
  let decrypted;
  try {
    decrypted = userDecipher.update(encrypted, 'hex', 'utf8');
    decrypted += userDecipher.final('utf8');
  } catch (ex) {
    decrypted = "*";
  }
  return decrypted;
}
