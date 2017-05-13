module.exports = class Cards {
    constructor(reply) {
      this.games = [];
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
      const parsedCommands = this.extractCommands(command);
      if (parsedCommands.isValid) {

      }
      else {
        return this.emitWarning(user, parsedCommands.reason);
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

    parseReason(command) {
      return `\'${command}\' is not a valid command. Please input \'/cards --help all\' for more information.`;
    }

};