module.exports = class BlackJack {
  constructor(deck, user, commands, reply) {
    this.deck = deck;
    this.players = {
        [user.id]: user
    };
    this.hands = {

    };
    this.numPlayers = 0;
    this.reply = reply;
    this.initiate(user, commands);
  }

  initiate(user, commands) {
    console.log(this.deck.cards.map(el => el.representation));
    // console.log(user, commands, this.cards);
  }

  addPlayer(user) {
    this.players[user.id] = user;
    console.log();
  }
};