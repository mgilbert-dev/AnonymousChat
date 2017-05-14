const Card = require('./Card.js');

module.exports = class Deck {
  constructor(game) {
    this.game = game;
    this.cards = this.shuffleCards(
      this.generateCards()
    );
  }

  shuffleCards(cards) {
    let m = cards.length;
    let i;
    let t;

    while (m) {

      i = Math.floor(Math.random() * m--);

      t = cards[m];
      cards[m] = cards[i];
      cards[i] = t;
    }

    return cards;
  }

  generateCards() {
    let cards = [];
    const suitMap = {
      0: 'spades',
      1: 'hearts',
      2: 'clubs',
      3: 'diamonds'
    };
    for (let i = 1; i < 14; i++) {
      for (let j = 0; j < 4; j++) {
        cards.push(new Card(i, suitMap[j]));
      }
    }
    return cards;
  }
};