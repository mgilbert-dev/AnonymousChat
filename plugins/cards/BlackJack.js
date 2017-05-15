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
          color: 'purple'
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
        color: 'purple'
      }
    });
    this.actionOn++;
    this.displayAction();
  }

  countPoints(player) {
    let total = 0;
    this.hands[player.id].forEach(card => {
      total += Math.min(card.value, 10);
    });
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
    let points = 0;

    this.dealer.hand.forEach(card => {
      if (card.value === 1) {
       points += 11;
      }
      else {
        points += Math.min(card.value, 10);
      }
    });
    let card;
    while (points < 17) {
      card = this.deck.deal(1)[0];
      this.dealer.hand.push(card);
      this.reply({
        broadcast: true,
        message: `Dealer hits ${card.representation.visual}.`,
        styling: {
          color: 'orange'
        }
      });
      points += Math.min(card.value,10);
      if (card.value === 1 && points < 12) {
        points += 10;
      }
    }
    if (points > 21) {
      this.reply({
        broadcast: true,
        message: `The dealer busts!`,
        styling: {
          color: 'orange'
        }
      });
    }
    else {
      this.reply({
        broadcast: true,
        message: `The dealer stands with ${points}.`,
        styling: {
          color: 'orange'
        }
      });
    }
    this.resolveGame();
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
    this.reply({
      broadcast: true,
      message: 'Available actions: \'/cards -bj [-hit/-stand/-double]\'.',
      styling: {
        color: 'deepskyblue'
      }
    });
  }

  getDecisionFrom(player) {
    this.reply({
      broadcast: true,
      message: `Action on ${player.name}.`,
      styling: {
        color: 'deepskyblue'
      }
    });
  }

  hit(user) {
    if (this.players[this.actionOn].id === user.id) {
      let card = this.deck.deal(1);
      this.hands[user.id].push(card[0]);
      this.analyzeTurn(user, card[0]);
    }
    else {
      this.reply({
        user: user,
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
      message: `${user.name} has started a game of Blackjack. Type \'/cards --join bj\' to join.`,
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
        color: 'purple'
      }
    });
  }

  stand(user) {
    if (this.players[this.actionOn].id === user.id) {
      let points = this.countPoints(user);
      if (points >>> 0 !== parseFloat(points)) {
        points = points.split(' or ')[1];
      }

      this.reply({
        broadcast: true,
        message:`${user.name} stands with ${points}`,
        styling: {
          color: 'purple'
        }
      });
      this.actionOn++;
      this.displayAction();
    }
    else {
      this.reply({
        user: user,
        message: `It is not your turn to stand.`,
        styling: {
          color: 'red'
        }
      });
    }
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

  findBestHand(hand) {
    let aceCount = 0;
    let points = 0;
    hand.forEach(card => {
      if (card.value === 1) {
        points += 11;
        aceCount++;
      }
      else {
        points += Math.min(card.value, 10);
      }
    });
    while (points > 21 && aceCount > 0) {
      points -= 10;
      aceCount--;
    }
    if (points > 21) {
      return false;
    }
    else {
      return points;
    }
  }

  payOutWinners(dealerHand, winners) {
    if (dealerHand) {
      this.reply({
        broadcast: true,
        message: `The dealer stood with ${dealerHand}, so the winners are: --${winners.map(el => el.player.name).join(' --')}`,
        styling: {
          color: 'deepskyblue'
        }
      });
    }
    else {
      this.reply({
        broadcast: true,
        message: `The dealer busted, so the winners are: --${winners.map(el => el.player.name).join(' --')}`,
        styling: {
          color: 'deepskyblue'
        }
      });
    }
  }

  resetGame() {
    this.phase = constants.GAME_STARTING;
    this.deck.shuffleCards();
    this.reply({
      broadcast: true,
      message: `Cards shuffled.`,
      styling: {
        color: 'orange'
      }
    });
    this.actionOn = 0;
    this.hands = {};
    this.dealer.hand = [];
    this.dealCardsToTable();
    
  }

  resolveGame() {
    let busts = [];
    let nonBusts = [];
    let winners = [];
    let dealerPoints = this.findBestHand(this.dealer.hand);
    this.players.forEach(player => {
      let points = this.findBestHand(this.hands[player.id]);
      if (points) {
        nonBusts.push({
          player: player,
          points: points
        });
      }
      else {
        busts.push(player);
      }
    });
    if (dealerPoints) {
      winners = nonBusts.filter(hand => {
        return hand.points > dealerPoints;
      });
    }
    else {
      winners = nonBusts;
    }
    this.payOutWinners(dealerPoints, winners);
    this.resetGame();
  }
};