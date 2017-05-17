const constants = require('./constants.js');

module.exports = class BlackJack {
  constructor(deck, user, commands, reply, playerCoins) {
    this.deck = deck;
    this.players = [user];
    this.dealer = {
      hand: [],
      name: 'dealer'
    };
    this.currentBets = {};
    this.hands = {};
    this.playerCoins = playerCoins;
    this.reply = reply;
    this.initiate(user);
    this.phase = constants.GAME_STARTING;
    this.actionOn = 0;
  }

  addPlayer(user) {
    if (this.players.find(el => el.id === user.id)) {
      this.sendMessage(`You have already joined the table`, 'red', false, user);
    }
    else {
      this.players.push(user);
      this.sendMessage(`${user.name} has joined the Blackjack table.`, 'gold', true);
      this.sendMessage(`Thanks for joining! Type \'/cards -bj -bet --amount [amount]\' to bet and \'/cards -bj -deal\' to deal.`, user.color, false, user);
    }
  }

  analyzeTurn(player, card) {
    let points = this.countPoints(player);

    if (points > 21) {
      this.bust(player, card);
    }
    else {
      this.sendMessage(`${player.name} hits ${card.representation.visual}, for a total of ${points}`,'gold', true);
      this.displayAction();
    }
  }

  bust(player, card) {
    this.sendMessage(`${player.name} hits ${card.representation.visual} and busts!`, 'gold', true);
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

    if (this.playerCoins[player.id] > 50) {
      this.currentBets[player.id] = this.currentBets[player.id] || 50;
      let cards = this.deck.deal(2);
      this.hands[player.id] = cards;
      let cardVisuals = this.deck.visualizeCards(cards);

      this.sendMessage(`Your cards are ${cardVisuals}`, player.color, false, player);
    }
    else {
      this.currentBets[player.id] = 0;
      let cards = this.deck.deal(2);
      this.hands[player.id] = cards;
      let cardVisuals = this.deck.visualizeCards(cards);

      this.sendMessage(`You don't have enough coins to make a bet, so your current bet is 0`, 'red', false, player);
      this.sendMessage(`Your cards are ${cardVisuals}`, player.color, false, player);
    }

    this.playerCoins[player.id] -= this.currentBets[player.id];
    
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

      this.sendMessage( `Dealer hits ${card.representation.visual}.`, 'gold', true);
      
      points += Math.min(card.value,10);

      if (card.value === 1 && points < 12) {
        points += 10;
      }
    }

    if (points > 21) {
      this.sendMessage( `The dealer busts!`, 'gold', true);
    }
    else {
      this.sendMessage( `The dealer stands with ${points}.`, 'gold', true);
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
    this.sendMessage(`Dealer: ${this.deck.visualizeCards(this.dealer.hand)}`, 'gold', true);
  
    this.players.forEach(player => {
      this.sendMessage(`--${player.name}: ${this.deck.visualizeCards(this.hands[player.id])}--`, 'gold', true);
      this.sendMessage(`--${player.name} | Bet / Total: $${this.currentBets[player.id]} / $${this.playerCoins[player.id]}`, player.color, true);
    });

    this.sendMessage('Available actions: \'/cards -bj [-hit/-stand/-double]\'.', 'white', true);
  }

  getDecisionFrom(player) {
    this.sendMessage(`Action on ${player.name}.`, 'deepskyblue', true);
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

  hit(user) {

    if (this.players[this.actionOn].id === user.id) {
      let card = this.deck.deal(1);
      this.hands[user.id].push(card[0]);
      this.analyzeTurn(user, card[0]);
    }
    else {
      this.sendMessage(`It is not your turn to hit.`, 'red', false, user);
    }
  }

  initiate(user) {
    this.sendMessage(`${user.name} has started a game of Blackjack. Type \'/cards --join bj\' to join.`, 'gold', true);
    this.sendMessage(`Thanks for joining! Type \'/cards -bj -bet --amount [amount]\' to bet and \'/cards -bj -deal\' to deal.`, user.color, false, user);
  }

  payOutWinners(dealerHand, winners) {

    if (dealerHand) {
      this.sendMessage(`The dealer stood with ${dealerHand}`, 'gold', true);
    }
    else {
      this.sendMessage(`The dealer busted`, 'gold', true);
    }
    if (winners.length > 0) {
      winners.forEach(winner => {
        this.playerCoins[winner.player.id] += (this.currentBets[winner.player.id] * 2);
        this.sendMessage(`${winner.player.name} wins $${this.currentBets[winner.player.id]} with a score of ${winner.points}`, winner.player.color, true);
      });
    }
    else {
        this.sendMessage(`House wins.`, 'gold', true);
    }
    
  }

  placeBet(user, commands) {
    if (!commands.amount || commands.amount >>> 0 !== parseFloat(commands.amount)) {
      this.sendMessage(`You must use an integer as an amount, and without square brackets. Example: \'/cards -bj -bet --amount [amount]\'`, 'red', false, user);
    }
    else if (this.playerCoins[user.id] > commands.amount) {
      this.currentBets[user.id] = commands.amount;
      this.sendMessage(`${user.name} placed a bet of $${commands.amount}.`, user.color, true);
    }
    else {
      this.currentBets[user.id] = 0;
      this.sendMessage(`You don't have enough coins to make the minimum bet, so your current bet is zero.`, 'red', false, user);
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
    else if (commands.bet && this.phase === constants.GAME_STARTING) {
      this.placeBet(user, commands);
    }
    else if (commands.reset) {
      this.sendMessage(`${user.name} reset the game.`, 'red', true);
      this.resetGame();
    }
    else {
      this.sendMessage(`That command is not valid right now`, 'red', false, user);
    }
  }

  resetGame() {
    this.phase = constants.GAME_STARTING;
    this.sendMessage(`Cards shuffled. Type \'/cards -bj -deal\' to deal.`, 'gold', true);

    this.actionOn = 0;
    this.hands = {};
    this.dealer.hand = [];
    
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

  stand(user) {

    if (this.players[this.actionOn].id === user.id) {
      let points = this.countPoints(user);

      if (points >>> 0 !== parseFloat(points)) {
        points = points.split(' or ')[1];
      }

      this.sendMessage(`${user.name} stands with ${points}`, 'gold', true);
      
      this.actionOn++;
      this.displayAction();
    }
    else {
      this.sendMessage(`It is not your turn to stand.`, 'red', false, user);
    }
  }
};