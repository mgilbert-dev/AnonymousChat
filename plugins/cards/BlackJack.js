const constants = require('./constants.js');

module.exports = class BlackJack {
  constructor(deck, user, commands, reply, playerCoins) {
    this.deck = deck;
    this.players = [user];
    this.dealer = {
      hand: [],
      name: 'dealer'
    };
    this.hands = {};
    this.playerCoins = playerCoins;
    this.reply = reply;
    this.initiate(user, commands);
    this.phase = constants.GAME_STARTING;
    this.actionOn = 0;
  }

  analyzeTurn(player, card) {
    let points = this.countPoints(player);
    if (points > 21) {
      this.bust(player, card);
    }
    else {
      this.reply({
        broadcast: true,
        message: `${player.name} hits ${card.representation.visual}, for a total of ${points}`,
        styling: {
          color: 'deepskyblue'
        }
      });
      this.displayAction();
    }
  }

  bust(player, card) {
    this.reply({
      broadcast: true,
      message: `${player.name} hits ${card.representation.visual} and busts!`,
      styling: {
        color: 'deepskyblue'
      }
    });
    this.actionOn++;
    this.displayAction();
  }

  countPoints(player) {
    let total = this.hands[player.id].reduce((a,b) => Math.min(a.value,10) + Math.min(b.value));
    if (this.hands[player.id].find(el => el.value === 1)) {
      if (total + 10 > 21) {
        return total;
      }
      else {
        return `${total} or ${total + 10}`;
      }
    }
    else {
      return total;
    }
  }

  dealCardsToPlayer(player) {
    let cards = this.deck.deal(2);
    this.hands[player.id] = cards;
    let cardVisuals = this.deck.visualizeCards(cards);
    this.reply({
      user: player,
      broadcast: false,
      message: `Your cards are ${cardVisuals}`,
      styling: {
        color: 'orange'
      }
    });
  }

  dealCardsToTable() {
    this.deck.shuffleCards();
    this.dealer.hand = this.deck.deal(2);
    this.players.forEach(player => {
      this.dealCardsToPlayer(player);
    });
    this.phase = constants.CARDS_DEALT;

    this.displayTableState();
    this.displayAction();
  }

  dealerTurn() {

  }

  displayAction() {
    switch (this.phase) {
      case constants.CARDS_DEALT:
        if (this.actionOn < this.players.length) {
          this.getDecisionFrom(this.players[this.actionOn]);
        }
        else {
          this.dealerTurn();
        }
        break;
    
      default:
        break;
    }
  }

  displayTableState() {
    this.reply({
      broadcast: true,
      message: `Dealer: ${this.deck.visualizeCards(this.dealer.hand)}`,
      styling: {
        color: 'orange'
      }
    });
    this.players.forEach(player => {
      this.reply({
          broadcast: true,
          message: `--${player.name}: ${this.deck.visualizeCards(this.hands[player.id])}--`,
          styling: {
            color: 'deepskyblue'
          }
        });
    });
  }

  getDecisionFrom(player) {
    this.reply({
      broadcast: true,
      message: `Action on ${player.name}. Type \'/cards -bj [-hit/-stand/-double]\'.`,
      styling: {
        color: 'deepskyblue'
      }
    });
  }

  hit(player) {
    if (this.players[this.actionOn].id === player.id) {
      let card = this.deck.deal(1);
      this.hands[player.id].push(card);
      this.analyzeTurn(player, card[0]);
    }
    else {
      this.reply({
        broadcast: true,
        message: `It is not your turn to hit.`,
        styling: {
          color: 'red'
        }
      });
    }
  }

  initiate(user, commands) {
    this.reply({
      broadcast: true,
      message: `${user.name} has started a game of Blackjack. Type \'/cards --join blackjack\' to join.`,
      styling: {
        color: 'deepskyblue'
      }
    });
  }

  addPlayer(user) {
    this.players.push(user);
    this.reply({
      broadcast: true,
      message: `${user.name} has joined the Blackjack table.`,
      styling: {
        color: 'deepskyblue'
      }
    });
  }

  stand(user) {
    let points = this.countPoints(user);
    if (points >>> 0 !== parseFloat(points)) {
      points = points.split(' or ')[1];
    }

    this.reply({
      broadcast: true,
      message:`${user.name} stands with ${this.deck.visualizeCards(this.hands[user.id])}`,
      styling: {
        color: 'deepskyblue'
      }
    });
    this.actionOn++;
    this.displayAction();

  }

  receiveCommand(user, commands) {
    if (commands.deal && this.phase === constants.GAME_STARTING) {
      this.dealCardsToTable();
    }
    else if (commands.hit && this.phase === constants.CARDS_DEALT) {
      this.hit(user);
    }
    else if (commands.stand && this.phase === constants.CARDS_DEALT) {
      this.stand(user);
    }
    else if (commands.double && this.phase === constants.CARDS_DEALT) {
      
    }
  }
};