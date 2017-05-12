## [Live](https://openchattr.herokuapp.com/)

### Features
- Light Socket.io powered chat.
- Mobile responsive.
- Supports various commands:
    1) /name \<name> - Change your displayed name.
    2) /color \<color> - Change the color of your text visible to everyone.
    3) /whisper \<name> <message> - Private message all users by that name.
    4) /users - List all users in channel (this is helpful for mobile users where the user list is not displayed due to limited real estate).
    5) /commands - List all available commands.
- Notifications for users that are currently tabbed out.
- Clicking on a user's name prefills message with a whisper.
- Users notified when others connect/disconnect.
- Adding plugins! Currently users can play Rock, Paper, Scissors through command line

### Plugins
Plugins are now usable, and with an established contract that defines how plugins can interact through the server with users in the channel. By adding the following key-values to the plugin object at the beginning of the file, and creating a class method called 'receiveCommand()' that takes two arguments (the user issuing the command, and an array of commands), the app integrates its available commands with those displayed to users when they request for a list of commands, directs commands prefixed with the plugin's key to the plugin.receiveCommand() function mentioned above, and initializes the plugin with a function that that if called inside the plugin, emits a payload to the users in a channel. The plugin has power over who receives the message and the CSS styling of it). Below is the aforementioned contract.

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

The first plugin (a game allowing the channel to engage in Rock, Paper, Scissors with each other) provides the first example:

    const RockPaperScissors = require('./addons/RockPaperScissors.js');

    const plugins = {
      rps: {
        availableCommands: [
          '\'/rps [number]\' - Initiates a game of \'Rock, Paper, Scissors\' with [number] open spots.', 
          '\'/rps [action]\' - If a game has started, declare your action with \'rock\',\'paper\',\'scissors\',\'r\',\'p\', or \'s\'.'
        ],
        plugin: new RockPaperScissors((payload) => reply('rps', payload))
      }
    };

    class RockPaperScissors {
      constructor(reply) {
        this.currentGame = false;
        this.players = {

        };
        this.numPlayers = 0;
        this.reply = reply;
      }

      receiveCommand(user, command) {
          ...do something
          this.reply({
              message: 'You guys rock!',
              broadcast: true,
              styling: {
                  color: 'DeepSkyBlue'
              }
          });
      }

### Limitations

- Chrome notification API doesn't seem to work in full screen. Notifications also don't always trigger immediately.
- Font sizes a bit inconsistent in mobile view.

### Vision

I decided against enforcing unique user names. I was a big fan of IRC back in the 90's, and I always enjoyed the somewhat chaotic nature of unrestricted chat. My app does not store anything into cookies, no messages are stored in a database, everything is anonymous. I see no reason to enforce unique names for a temporary identifier. If you want to whisper to someone, it is your responsibility to make sure that there is only one person that will receive it (if multiple people share one username, they will all receive your whisper -- which might also be what you intended). Under the hood, each user is assigned an id of random characters so as to ensure the server does not confuse users (so that someone with your username won't see your outgoing whispers, for example).

Besides the 'fun side' of anonymous chat, I also see practical value to a platform that facilitates anonymous communication, be it between friends discussing an important issue without the fear of being associated with their controversial opinion, or coworkers discussing important issues without fear of retribution from management. While this app certainly isn't 'there' yet, future plans include the ability to create rooms.
