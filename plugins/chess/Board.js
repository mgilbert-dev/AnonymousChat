module.exports = class Board {
  constructor() {
    this.board = 'rnbqkbnrpppppppp--------------------------------PPPPPPPPRNBQKBNR';
    this.currentTurn = 'w';
    this.legalMoves = this.findLegalMoves(this.board, this.currentTurn);
  }

  findLegalMoves(board, currentTurn) {
    let legalMoves = [];
    let move;
    for (let i = 0; i < board.length; i++) {
      switch (board[i]) {

        case 'r':
          if (currentTurn === 'b') {
            legalMoves = legalMoves.concat(this.getRookMoves(i, board));
          }
          break;

        case 'n':
          if (currentTurn === 'b') {
            legalMoves = legalMoves.concat(this.getKnightMoves(i, board));
          }
          break;

        case 'b':
          if (currentTurn === 'b') {
            legalMoves = legalMoves.concat(this.getRookMoves(i, board));
          }
          break;

        case 'q':
          if (currentTurn === 'b') {
            legalMoves = legalMoves.concat(this.getQueenMoves(i, board));
          }
          break;

        case 'k':
          if (currentTurn === 'b') {
            legalMoves = legalMoves.concat(this.getKingMoves(i, board));
          }
          break;

        case 'p':
          if (currentTurn === 'b') {
            legalMoves = legalMoves.concat(this.getPawnMoves(i, board));
          }
          break;

        case 'R':
          if (currentTurn === 'w') {
            legalMoves = legalMoves.concat(this.getRookMoves(i, board));
          }
          break;
        
        case 'N':
          if (currentTurn === 'w') {
            legalMoves = legalMoves.concat(this.getKnightMoves(i, board));
          }
          break;

        case 'B':
          if (currentTurn === 'w') {
            legalMoves = legalMoves.concat(this.getBishopMoves(i, board));
          }
          break;
        
        case 'Q':
          if (currentTurn === 'w') {
            legalMoves = legalMoves.concat(this.getQueenMoves(i, board));
          }
          break;

        case 'K':
          if (currentTurn === 'w') {
            legalMoves = legalMoves.concat(this.getKingMoves(i, board));
          }
          break;

        case 'P':
          if (currentTurn === 'w') {
            legalMoves = legalMoves.concat(this.getPawnMoves(i, board));
          }
          break;

        default:
          break;
      }
    }

    return legalMoves.filter( el => {
      return this.isCheck(currentTurn, this.testMove(el, board));
    });
  }

  /*
  0  1  2  3  4  5  6  7
  8  9  10 11 12 13 14 15
  16 17 18 19 20 21 22 23
  24 25 26 27 28 29 30 31
  32 33 34 35 36 37 38 39
  40 41 42 43 44 45 46 47
  48 49 50 51 52 53 54 55
  56 57 58 59 60 61 62 63
  */

  getBishopMoves(position, board) {
    let increments = [9, 7, -9, -7];
    let color = this.getColor(position, board);
    let legalMoves = [];
    for (let i = 0; i < increments.length; i++) {
      let pointer = position;
      while (pointer < 63 && pointer > 0 && (pointer + increments[i]) % 8 !== 0) {
        pointer += increments[i];
        if (board[pointer] === '-') {
          legalMoves.push(`${position}-${board[pointer]}`);
        } else if (this.getColor(board[pointer]) !== color) {
          legalMoves.push(`${position}-${board[pointer]}`);
          break;
        } else {
          break;
        }
      }
    }
    return legalMoves;
  }

  getBoard() {
    return this.board;
  }

  getColor(position, board) {
    return board[position].toUpperCase() === board[position] ? 'w' : 'b';
  }

  getKnightMoves(position, board) {

  }

  getKingMoves(position, board) {

  }

  getPawnMoves(position, board) {

  }

  getQueenMoves(position, board) {
    
  }

  getRookMoves(position, board) {

  }
  
  isCheck(currentPlayer, board) {
    // Check for attackers
    return false;
  }

  isLegalMove(from, to) {
    return Boolean(this.legalMoves.includes(`${from}-${to}`));
  }

  makeMove(from, to) {

  }

  testMove(move, board) {
    let from = move.split('-')[0];
    let to = move.split('-')[1];
    let placePiece = board.substr(0, to) + board[from] + board.substr(to + 1);
    let removePiece = placePiece.substr(0, from) + '-' + placePiece.substr(from + 1);
    return removePiece;
  }
};