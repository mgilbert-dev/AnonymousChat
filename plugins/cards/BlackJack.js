module.exports = class BlackJack {
  constructor(cards, user, commands, reply) {
    this.cards = cards;
    this.players = {
        [user.id]: user
    };
    this.numPlayers = 0;
    this.initiate(user, commands);
  }

  initiate(user, commands) {
    console.log(user, commands);
  }
};