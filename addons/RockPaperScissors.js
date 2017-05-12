module.exports = class RockPaperScissors {
  constructor(users, io) {
    this.currentGame = false;
    this.players = {

    };
    this.users = users;
    this.numPlayers = 0;
    this.io = io;
  }

  categorizePlayers() {
    let results = {

    };

    results.rock = Object.keys(this.players).filter(el => {
      return this.players[el] === 'rock' || this.players[el] === 'r';
    })
    .map(el => this.users[el].name);

    results.paper = Object.keys(this.players).filter(el => {
      return this.players[el] === 'paper' || this.players[el] === 'p';
    })
    .map(el => this.users[el].name);

    results.scissors = Object.keys(this.players).filter(el => {
      return this.players[el] === 'scissors' || this.players[el] === 's';
    })
    .map(el => this.users[el].name);

    return results;
  }

  constructMessagePart(category) {
    let messagePart = "";

    for (let i = 0; i < category.length; i++) {

      if (category.length === 1) {
        messagePart += category[i];
      }
      else if (i === category.length - 1) {
        messagePart += `and ${category[i]}`;
      }
      else if (category.length > 2) {
        messagePart += `${category[i]}, `;
      }
      else {
        messagePart += `${category[i]} `;
      }
    }

    return messagePart;
  }

  emitWarning(user, message) {
    this.io.emit('warning', {
      warning: message,
      user: user,
      styling: {
        color: 'red'
      }
    });
  }

  generateMessage(categories) {
    let message = "The results are in! ";
    let paperPlayers = this.constructMessagePart(categories.paper)|| "nobody";
    let rockPlayers = this.constructMessagePart(categories.rock)|| "nobody";
    let scissorsPlayers = this.constructMessagePart(categories.scissors)|| "nobody";

    message += `Playing as rock, ${rockPlayers} beat ${scissorsPlayers}. Playing as paper, ${paperPlayers} beat ${rockPlayers}. And playing as scissors, ${scissorsPlayers} beat ${paperPlayers}.`;
    return message;
  }

  isGameOver() {
    return this.numPlayers === Object.keys(this.players).length;
  }

  isValidAction(action) {
    return ['rock', 'paper', 'scissors', 'r', 'p', 's'].includes(action);
  }

  isValidNumPlayers(numPlayers) {
    return numPlayers <= Object.keys(this.users).length;
  }

  resetGame() {
    this.currentGame = false;
    this.players = {};
    this.numPlayers = 0;
  }

  resolveGame(user) {
    let categories = this.categorizePlayers();
    let message = this.generateMessage(categories);
    
    this.resetGame();
    
    this.io.emit('rps', {
      user: user,
      broadcast: true,
      message: message,
      styling: {
        color: 'deepskyblue'
      }
    });
  }

  setPlayerAction(user, action) {
    this.players[user.id] = action;
  }

  startGame(numPlayers) {
    this.currentGame = true;
    this.numPlayers = parseInt(numPlayers);
  }

  takeCommand(user, command) {
    if (this.currentGame) {
      if (this.isValidAction(command)) {
        this.setPlayerAction(user, command);     
      }
      else {
        return this.emitWarning(user, 'Invalid action. Valid inputs are \'rock\',\'paper\',\'scissors\',\'r\',\'p\', or \'s\'');
      }
      if (this.isGameOver()) {
        this.resolveGame(user);
      }
      else {
        this.io.emit('rps', {
          user: user,
          broadcast: true,
          message: `${user.name} has submitted their decision. ${this.numPlayers - Object.keys(this.players).length} spot(s) left.`,
          styling: {
            color: 'deepskyblue'
          }
        });
      }
    }
    else if (this.isValidNumPlayers(command)) {
      this.startGame(command);
      this.io.emit('rps', {
        user: user,
        broadcast: true,
        message: `${user.name} has started a game of \'Rock, Paper, Scissors\', and initiated it to ${command} players. The game will resolve once ${command} players have submitted their choice. Type \'/commands\' for instructions.`,
        styling: {
          color: 'deepskyblue'
        }
      });
    }
    else {
      return this.emitWarning(user, 'The game has either already been initiated or you didn\'t enter a number smaller than the number of users in the room');
    }
  }
};