var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var users = {

};

var activities = {
  rockPaperScissors: {
    currentGame: false,
    players: {
      
    }
  }
};

io.on('connection', function(socket) {

  socket.on('user connected', function(userId) {
    users[userId] = {
      name: 'Anonymous-user',
      socketId: socket.id,
      color: 'limegreen',
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

    case '/rps':
      if (activities.rockPaperScissors.currentGame) {
        if (['rock', 'paper', 'scissors', 'r', 'p', 's'].includes(argument)) {
          activities.rockPaperScissors.players[payload.id] = argument;
        }
        else {
           emitWarning('Invalid action. Valid inputs are \'rock\',\'paper\',\'scissors\',\'r\',\'p\', or \'s\'', payload.id);
        }
        if (parseInt(activities.rockPaperScissors.numPlayers) === Object.keys(activities.rockPaperScissors.players).length) {
          let rock = [];
          let rockPlayers = "";
          let paper = [];
          let paperPlayers = "";
          let scissors = [];
          let scissorsPlayers = "";
          for (let player in activities.rockPaperScissors.players) {
            if (activities.rockPaperScissors.players.hasOwnProperty(player)) {
              let action = activities.rockPaperScissors.players[player];
              let playerName = users[player].name;
              if (action === 'rock' || action === 'r') {
                rock.push(playerName);
              }
              else if (action === 'paper' || action === 'p') {
                paper.push(playerName);
              }
              else if (action === 'scissors' || action === 's') {
                scissors.push(playerName);
              }
            }
          }
          let message = "The results are in! ";
          for (let i = 0; i < paper.length; i++) {
            if (paper.length === 1) {
              paperPlayers += paper[i];
            }
            else if (i === paper.length - 1) {
              paperPlayers += `and ${paper[i]}`;
            }
            else if (paper.length > 2) {
              paperPlayers += `${paper[i]}, `;
            }
            else {
              paperPlayers += `${paper[i]} `;
            }
          }
          for (let j = 0; j < rock.length; j++) {
            if (rock.length === 1) {
              rockPlayers += rock[j];
            }
            else if (j === rock.length - 1) {
              rockPlayers += `and ${rock[j]}`;
            }
            else if (rock.length > 2) {
              rockPlayers += `${rock[j]}, `;
            }
            else {
              rockPlayers += `${rock[j]} `;
            }
          }
          for (let k = 0; k < scissors.length; k++) {
            if (scissors.length === 1) {
              scissorsPlayers += scissors[k];
            }
            else if (k === scissors.length - 1) {
              scissorsPlayers += `and ${scissors[k]}`;
            }
            else if (scissors.length > 2) {
              scissorsPlayers += `${scissors[k]}, `;
            }
            else {
              scissorsPlayers += `${scissors[k]} `;
            }
          }
          rockPlayers = rockPlayers || "nobody";
          paperPlayers = paperPlayers || "nobody";
          scissorsPlayers = scissorsPlayers || "nobody";
          message += `Playing as rock, ${rockPlayers} beat ${scissorsPlayers}. Playing as paper, ${paperPlayers} beat ${rockPlayers}. And playing as scissors, ${scissorsPlayers} beat ${paperPlayers}.`;
          activities.rockPaperScissors = {
            currentGame: false,
            players: {
              
            }
          };
          io.emit('rps', {
            id: payload.id,
            broadcast: true,
            message: message
          });
        }
        else {
          io.emit('rps', {
            id: payload.id,
            broadcast: true,
            message: `${users[payload.id].name} has submitted their decision. ${activities.rockPaperScissors.numPlayers - Object.keys(activities.rockPaperScissors.players).length} spots left.`
          });
        }
      }
      else if (argument <= Object.keys(users).length) {
        activities.rockPaperScissors.currentGame = true;
        activities.rockPaperScissors.numPlayers = argument;
        io.emit('rps', {
          id: payload.id,
          broadcast: true,
          message: `${users[payload.id].name} has started a game of \'Rock, Paper, Scissors\', and initiated it to ${argument} players. The game will resolve once ${argument} players have submitted their choice. Type \'/commands\' for instructions.`
        });
      }
      else {
        emitWarning('The game has either already been initiated or you didn\'t enter a number larger than the number of users in the room', payload.id);
      }
      break;

    case '/commands':
      io.emit('list commands', {
        commands: ['\'/name [name]\' - change your name.', '\'/color [color]\' - change your font color.', '\'/users\' - List users in room.', '\'/whisper [name] [message]\' - Directly message everyone with that name.','\'/rps [number]\' - Initiates a game of \'Rock, Paper, Scissors\' with [number] open spots.', '\'/rps [action]\' - If a game has started, declare your action with \'rock\',\'paper\',\'scissors\',\'r\',\'p\', or \'s\'.'],
        id: payload.id
      });
      break;
    default:
  }
}



function emitWarning(message, userId) {
  io.emit('warning', {
    warning: message,
    id: userId
  });
}
