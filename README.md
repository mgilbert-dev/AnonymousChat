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

### Limitations

- Chrome notification API doesn't seem to work in full screen. Notifications also don't always trigger immediately.
- Font sizes a bit inconsistent in mobile view.

### Vision

I decided against enforcing unique user names. I was a big fan of IRC back in the 90's, and I always enjoyed the somewhat chaotic of unrestricted chat. My app does not store anything into cookies, no messages are stored in a database, everything is anonymous. I see no reason to enforce unique names for a temporary identifier. If you want to whisper to someone, it is your responsibility to make sure that there is only one person that will receive it (if multiple people share one username, they will all receive your whisper -- which might also be what you intended). Under the hood, each user is assigned an id of random characters so as to ensure the server does not confuse users (so that someone with your username won't see your outgoing whispers, for example).

Besides the 'fun side' of anonymous chat, I also see practical value to a platform that facilitates anonymous communication, be it between friends discussing an important issue without the fear of being associated with their controversial opinion, or coworkers discussing important issues without fear of retribution from management. While this app certainly isn't 'there' yet, future plans include the ability to create rooms.
