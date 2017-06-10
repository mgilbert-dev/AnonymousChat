const Game = require('./Game.js');

module.exports =  class Chess {
  constructor(reply, render) {
    this.reply = reply;
    this.render = render;
    this.games = {

    };
  }

  extractCommands(commands) {
    let parsedCommands = {};
    let isValid = true;
    let reason = "";
    
    for (let i = 0; i < commands.length; i++) {

      if (commands[i].startsWith('--')) {
        parsedCommands[commands[i].slice(2)] = commands[i + 1];
        i++;
      }
      else if (commands[i].startsWith('-')) {
        parsedCommands[commands[i].slice(1)] = true;
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

  parseReason(command) {
    return `\'${command}\' is not a valid command.`;
  }

  receiveCommand(user, command) {

    const parsedCommands = this.extractCommands(command);

    if (parsedCommands.isValid) {
      if (parsedCommands.challenge) {
        this.start(user, parsedCommands);
      }
      else {
        this.sendMessage('You must issue one of the following commands: \'/cards --start [game] -[#users]\',\'/cards --join [game]\', or \'--help [game]/all\'', 'red', false, user);
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

  start(user, parsedCommands) {
    let newGame = new Game(user);
    this.games[parsedCommands.challenge] = newGame;
    let html = newGame.generateHtml();
    this.render({
      user: user,
      html: html
    });
  }
};