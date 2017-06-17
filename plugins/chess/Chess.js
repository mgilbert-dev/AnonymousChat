const Game = require('./Game.js');

module.exports =  class Chess {
  constructor(reply, render) {
    this.reply = reply;
    this.render = render;
    this.games = {

    };
    this.users = {

    };
  }

  extractCommands(commands) {
    let parsedCommands = {};
    let isValid = true;
    let reason = "";
    for (let i = 0; i < commands.length; i++) {

      if (commands[i].startsWith('--')) {
        parsedCommands[commands[i].slice(2)] = commands[i + 1] || true;
        i++;
      }
      else if (commands[i].startsWith('-')) {
        parsedCommands[commands[i].slice(1)] = i;
        parsedCommands.move = true;
      }
      else {
        return {
          isValid: false,
          reason: this.parseReason(commands[i])
        };
      }
    }
    
    if (this.isValidCommands(parsedCommands)) {
      parsedCommands.isValid = true;
      return parsedCommands;
    }
    else {
      return {
        isValid: false,
        reason: 'That is not a valid command. Please input \'/commands\' for more information.'
      };
    }
  }

  isValidCommands(parsedCommands) {
    return true;
  }

  joinGame(user, parsedCommands) {
    if (!this.games[parsedCommands.accept]) {
      this.sendMessage(`There are no games with an id of ${parsedCommands.accept}. Start a game by typing \'/chess --challenge ${parsedCommands.accept}\'.`, 'red', false, user);
    } else if (this.games[parsedCommands.accept].hasOpenSpot()) {
      this.games[parsedCommands.accept].joinGame(user);
      this.users[user.id] = parsedCommands.accept;
      this.games[parsedCommands.accept].renderBoardState(user, this.render);
      this.sendMessage(`${user.name} has joined game ${parsedCommands.accept}! Watch their game by typing \'/chess --watch ${parsedCommands.accept}\'.`, 'seagreen', true);
    } else {
      this.sendMessage(`There are no free spots left. Watch this game by typing \'/chess --watch ${parsedCommands.accept}\'.`, 'red', false, user);
    }
  }

  move(user, parsedCommands) {
    let from, to;
    for (let command in parsedCommands) {
      if (parsedCommands.hasOwnProperty(command)) {
        if (parsedCommands[command] === 0) {
          from = command;
        } else if (parsedCommands[command] === 1) {
          to = command;
        }
      }
    }

    this.games[this.users[user.id]].makeMove(user, from, to, this.sendMessage.bind(this), this.render.bind(this));
  }

  parseReason(command) {
    return `\'${command}\' is not a valid command.`;
  }

  receiveCommand(user, command) {

    const parsedCommands = this.extractCommands(command);

    if (parsedCommands.isValid) {
      if (parsedCommands.challenge) {
        this.startGame(user, parsedCommands);
      } else if (parsedCommands.move) {
        this.move(user, parsedCommands);
      } else if (parsedCommands.accept) {
        this.joinGame(user, parsedCommands);
      } else if (parsedCommands.watch) {
        this.watchGame(user, parsedCommands);
      } else if (parsedCommands.reset) {
        this.resetGame(user);
      }
      else {
        this.sendMessage('You must issue one of the following commands: \'/chess --challenge [gameId]\',\'/chess --accept [gameId]\', or \'--chess --watch [gameId]\'', 'red', false, user);
      }
    }
    else {
      this.sendMessage(parsedCommands.reason, 'red', false, user);
    }
  }

  resetGame(user) {
    if (this.games[this.users[user.id]]) {
      this.games[this.users[user.id]].resetGame(user, this.sendMessage.bind(this), this.render.bind(this));
    }
  }

  sendMessage(message, color, broadcast = true, user = false) {

    if (broadcast) {
      this.reply({
        broadcast: true,
        message: message,
        styling: {
          color: color
        }
      });
    }
    else {
      this.reply({
        user: user,
        message: message,
        styling: {
          color: color
        }
      });
    }
  }

  startGame(user, parsedCommands) {
    if (!this.games[parsedCommands.challenge]) {
      let newGame = new Game(user);
      this.games[parsedCommands.challenge] = newGame;
      this.users[user.id] = parsedCommands.challenge;
      this.games[parsedCommands.challenge].renderBoardState(user, this.render);
      this.sendMessage(`${user.name} has started a game of Chess! Accept their challenge by typing \'/chess --accept ${parsedCommands.challenge}\'.`, 'seagreen', true);
    } else {
      this.sendMessage(`Someone has already created a game with this challenge id. Accept their challenge by typing \'/chess --accept ${parsedCommands.challenge}\'.`, 'red', false, user);
    }
  }

  watchGame(user, parsedCommands) {
    if (!this.games[parsedCommands.watch]) {
      this.sendMessage(`There are no games with an id of ${parsedCommands.watch}. Start a game by typing \'/chess --challenge ${parsedCommands.watch}\'.`, 'red', false, user);
    } else {
      this.games[parsedCommands.watch].watchGame(user);
      this.games[parsedCommands.watch].renderBoardState(user, this.render);
      this.sendMessage(`${user.name} has started watching a game of Chess! Join them by typing \'/chess --watch ${parsedCommands.watch}\'.`, 'seagreen', true);
    }
  }
};