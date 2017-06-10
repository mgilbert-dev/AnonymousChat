const Game = require('./Game.js');

module.exports =  class Chess {
  constructor(reply, render) {
    this.reply = reply;
    this.render = render;
    this.games = {

    };
  }

  checkMove(user, parsedCommands) {
    console.log(user, parsedCommands);
  }

  extractCommands(commands) {
    let parsedCommands = {};
    let isValid = true;
    let reason = "";
    console.log(commands);
    for (let i = 0; i < commands.length; i++) {

      if (commands[i].startsWith('--')) {
        parsedCommands[commands[i].slice(2)] = commands[i + 1];
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
    this.games[parsedCommands.accept].joinGame(user);
    let html = this.games[parsedCommands.accept].generateHtml(user);
    this.sendMessage(`${user.name} has joined game ${parsedCommands.accept}! Watch their game by typing \'/chess --watch ${parsedCommands.accept}\'.`, 'seagreen', true);
    this.render({
      user: user,
      html: html
    });
  }

  parseReason(command) {
    return `\'${command}\' is not a valid command.`;
  }

  receiveCommand(user, command) {

    const parsedCommands = this.extractCommands(command);

    if (parsedCommands.isValid) {
      if (parsedCommands.challenge) {
        this.startGame(user, parsedCommands);
      }
      else if (parsedCommands.move) {
        this.checkMove(user, parsedCommands);
      }
      else if (parsedCommands.accept) {
        this.joinGame(user, parsedCommands);
      } else if (parsedCommands.watch) {
        this.watchGame(user, parsedCommands);
      }
      else {
        this.sendMessage('You must issue one of the following commands: \'/chess --challenge [gameId]\',\'/chess --accept [gameId]\', or \'--chess --watch [gameId]\'', 'red', false, user);
      }
    }
    else {
      this.sendMessage(parsedCommands.reason, 'red', false, user);
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
    let newGame = new Game(user);
    this.games[parsedCommands.challenge] = newGame;
    let html = newGame.generateHtml(user);
    this.sendMessage(`${user.name} has started a game of Chess! Accept their challenge by typing \'/chess --accept ${parsedCommands.challenge}\'.`, 'seagreen', true);
    this.render({
      user: user,
      html: html
    });
  }

  watchGame(user, parsedCommands) {
    this.games[parsedCommands.watch].watchGame(user);
    let html = this.games[parsedCommands.watch].generateHtml(user);
    this.sendMessage(`${user.name} has started watching a game of Chess! Join them by typing \'/chess --watch ${parsedCommands.watch}\'.`, 'seagreen', true);
    this.render({
      user: user,
      html: html
    });
  }
};