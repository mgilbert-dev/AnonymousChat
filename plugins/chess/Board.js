module.exports = class Board {
  constructor() {
    this.board = 'rnbqkbnrpppppppp--------------------------------PPPPPPPPRNBQKBNR';
  }

  getBoard() {
    return this.board;
  }
};