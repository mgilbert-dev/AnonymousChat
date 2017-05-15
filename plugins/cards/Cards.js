const BlackJack = require('./BlackJack.js');
const Deck = require('./Deck.js');
const constants = require('./constants.js');

module.exports = class Cards {
  constructor(reply) {
    this.games = {
      
    };
    this.reply = reply;

    this.playerCoins = {

    };

  }

  emitWarning(user, message) {
    this.reply({
      message: message,
      user: user,
      styling: {
        color: 'red'
      }
    });
  }

  receiveCommand(user, command) {
    // if (user) {
    //   return this.emitWarning(user, 'Cards is currently in development. Features coming soon.');
    // }

    const parsedCommands = this.extractCommands(command);
    if (parsedCommands.isValid) {
      if (parsedCommands.start) {
        this.startGame(user, parsedCommands);
      }
      else if (parsedCommands.help) {
        this.getHelp(user, parsedCommands);
      }
      else if (parsedCommands.join) {
        this.joinGame(user, parsedCommands);
      }
      else if (parsedCommands.bj && this.games.bj) {
        this.games.bj.receiveCommand(user, parsedCommands);
      }
      else {
        return this.emitWarning(user, 'You must issue one of the following commands: \'/cards --start [game] -[#players]\',\'/cards --join [game]\', or \'--help [game]/all\'');
      }
    }
    else {
      return this.emitWarning(user, parsedCommands.reason);
    }
  }

  getHelp(user, parsedCommands) {

  }

  joinGame(user, parsedCommands) {
    switch (parsedCommands.join.toLowerCase()) {
      case 'blackjack':
        if (this.games.bj) {
          this.games.bj.addPlayer(user);
        }
        else {         
          this.emitWarning(user, 'There is no open game of blackjack. Type /cards --start blackjack to start one.');
        }
        break;
    
      default:
        break;
    }
  }

  startGame(user, parsedCommands) {
    switch (parsedCommands.start.toLowerCase()) {
      case 'blackjack':
        if (!this.games.bj) {
          let cards = new Deck(constants.BLACKJACK);
          this.games.bj = new BlackJack(cards, user, parsedCommands, this.reply);
        }
        else {
          this.emitWarning(user, 'A game of blackjack is already in progress. Type /cards --join blackjack to join.');
        }
        break;
    
      default:
        break;
    }
  }

  extractCommands(commands) {
    let parsedCommands = {
      
    };
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
        reason: 'That is not a valid command. Please input \'/cards --help all\' for more information.'
      };
    }
  }

  isValidCommands(parsedCommands) {
    return true;
  }

  parseReason(command) {
    return `\'${command}\' is not a valid command. Please input \'/cards --help all\' for more information.`;
  }
};