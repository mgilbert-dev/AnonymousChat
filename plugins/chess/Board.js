module.exports = class Board {
  constructor() {
    this.board = '00000000000rnbqkbnr00pppppppp00--------00--------00--------00--------00PPPPPPPP00RNBQKBNR00000000000';
    this.currentTurn = 'w';
    this.legalMoves = this.findLegalMoves(this.board, this.currentTurn);
    this.specialMoves = {
      w: {
        queenSideCastle: true,
        kingSideCastle: true,
        enPassant: false
      },
      b: {
        queenSideCastle: true,
        kingSideCastle: true,
        enPassant: false
      }
    };
  }

  castle(from, to) {
    if (from > to) {
      this.board = this.updateBoard(this.board, to + 1, this.board[from - 4]);
      this.board = this.updateBoard(this.board, from - 4, '-');
    } else {
      this.board = this.updateBoard(this.board, to - 1, this.board[from + 3]);
      this.board = this.updateBoard(this.board, from + 3, '-');
    }
  }

  findLegalMoves(board = this.board, currentTurn = this.currentTurn) {
    let legalMoves = [];
    let move;
    for (let i = 0; i < board.length; i++) {
      switch (board[i]) {

        case 'r':
          if (currentTurn === 'b') {
            legalMoves = legalMoves.concat(this.getRookMoves(i, board, currentTurn));
          }
          break;

        case 'n':
          if (currentTurn === 'b') {
            legalMoves = legalMoves.concat(this.getKnightMoves(i, board, currentTurn));
          }
          break;

        case 'b':
          if (currentTurn === 'b') {
            legalMoves = legalMoves.concat(this.getRookMoves(i, board, currentTurn));
          }
          break;

        case 'q':
          if (currentTurn === 'b') {
            legalMoves = legalMoves.concat(this.getQueenMoves(i, board, currentTurn));
          }
          break;

        case 'k':
          if (currentTurn === 'b') {
            legalMoves = legalMoves.concat(this.getKingMoves(i, board, currentTurn));
          }
          break;

        case 'p':
          if (currentTurn === 'b') {
            legalMoves = legalMoves.concat(this.getPawnMoves(i, board, currentTurn));
          }
          break;

        case 'R':
          if (currentTurn === 'w') {
            legalMoves = legalMoves.concat(this.getRookMoves(i, board, currentTurn));
          }
          break;
        
        case 'N':
          if (currentTurn === 'w') {
            legalMoves = legalMoves.concat(this.getKnightMoves(i, board, currentTurn));
          }
          break;

        case 'B':
          if (currentTurn === 'w') {
            legalMoves = legalMoves.concat(this.getBishopMoves(i, board, currentTurn));
          }
          break;
        
        case 'Q':
          if (currentTurn === 'w') {
            legalMoves = legalMoves.concat(this.getQueenMoves(i, board, currentTurn));
          }
          break;

        case 'K':
          if (currentTurn === 'w') {
            legalMoves = legalMoves.concat(this.getKingMoves(i, board, currentTurn));
          }
          break;

        case 'P':
          if (currentTurn === 'w') {
            legalMoves = legalMoves.concat(this.getPawnMoves(i, board, currentTurn));
          }
          break;

        default:
          break;
      }
    }
    return legalMoves.filter( el => {
      return !this.isCheck(currentTurn, this.testMove(el, board));
    });
  }

  getBishopMoves(position, board, color) {
    return this.getSlidingPiecesMovements(position, board, color, [9, 11, -9, -11]); 
  }

  getBoard() {
    return this.board;
  }

  getColor(position, board) {
    if (!board[position]) return false;
    return board[position].toUpperCase() === board[position] ? 'w' : 'b';
  }

  getKnightMoves(position, board, color) {
    return this.getSteppingPiecesMovements(position, board, color, [-12, -21, -19, -8, 12, 21, 19, 8]); 
  }

  getKingMoves(position, board, color) {
    let legalMoves = [];
    if (this.specialMoves[color].kingSideCastle && board[position + 1] === '-' && board[position + 2] === '-') {
      legalMoves.push(`${position}-${position + 2}`);
    }
    
    if (this.specialMoves[color].queenSideCastle && board[position - 1] === '-' && board[position - 2] === '-' && board[position - 3] === '-') {
      legalMoves.push(`${position}-${position - 2}`);
    }
    return legalMoves.concat(this.getSteppingPiecesMovements(position, board, color, [-1, -11, -10, -9, 1, 11, 10, 9]));
  }

  getPawnMovements(position, board, color, increments) {
    let legalMoves = [];
    for (let i = 0; i < increments.length; i++) {
      let pointer = position + increments[i];
      if (board[pointer] === '-') {
        legalMoves.push(`${position}-${pointer}`);
      }
    }

    let leftCapture = this.getColor(position + increments[0] - 1, board);
    let rightCapture = this.getColor(position + increments[0] + 1, board);
    if (leftCapture && leftCapture !== color) {
      legalMoves.push(`${position}-${position + increments[0] - 1}`);
    }
    if (rightCapture && rightCapture !== color) {
      legalMoves.push(`${position}-${position + increments[0] + 1}`);
    }
    //Check for en passant here
    return legalMoves;
  }

  getPawnMoves(position, board, color) {
    if (color === 'w' && position > 70 && position < 79) {
      return this.getPawnMovements(position, board, color, [-10, -20]);
    } else if (color === 'b' && position > 20 && position < 29) {
      return this.getPawnMovements(position, board, color, [10, 20]);
    } else if (color === 'w'){
      return this.getPawnMovements(position, board, color, [-10]);
    } else {
      return this.getPawnMovements(position, board, color, [10]);
    }
  }

  getQueenMoves(position, board, color) {
    return this.getSlidingPiecesMovements(position, board, color, [9, 11, -9, -11, -1, 1, -10, 10]);
  }

  getRookMoves(position, board, color) {
    return this.getSlidingPiecesMovements(position, board, color, [-1, 1, -10, 10]);
  }

  getSlidingPiecesMovements(position, board, color, increments) {
    let legalMoves = [];
    for (let i = 0; i < increments.length; i++) {
      let pointer = position;
      while (board[pointer]) {
        pointer += increments[i];
        if (board[pointer] === '-') {
          legalMoves.push(`${position}-${pointer}`);
        } else if (this.getColor(pointer, board) !== color) {
          legalMoves.push(`${position}-${pointer}`);
          break;
        } else {
          break;
        }
      }
    }
    return legalMoves;
  }

  getSteppingPiecesMovements(position, board, color, increments) {
    let legalMoves = [];
    for (let i = 0; i < increments.length; i++) {
      let pointer = position + increments[i];
      if (!board[pointer]) {
        continue;
      } else if (board[pointer] === '-') {
        legalMoves.push(`${position}-${pointer}`);
      } else if (this.getColor(pointer, board) !== color) {
        legalMoves.push(`${position}-${pointer}`);
      }
    }
    return legalMoves;
  }

  isAttackedBy(moves, board, color, type) {
    return moves
      .filter(move => {
        return board[move.split('-')[1]].toUpperCase() === type.toUpperCase() &&
          this.getColor(move.split('-')[1], board) !== color;
      })
      .map(pos => {
        return pos.split('-')[1];
      });
  }

  isAttackedByBishop(position, board, color) {
    return this.isAttackedBy(
      this.getBishopMoves(position, board, color),
      board, color, 'B'
    );
  }

  isAttackedByKing(position, board, color) {
    return this.isAttackedBy(
      this.getKingMoves(position, board, color),
      board, color, 'K'
    );
  }

  isAttackedByKnight(position, board, color) {
    return this.isAttackedBy(
      this.getKnightMoves(position, board, color),
      board, color, 'N'
    );
  }

  isAttackedByPawn(position, board, color) {
    return this.isAttackedBy(
      this.getPawnMoves(position, board, color),
      board, color, 'P'
    );
  }

  isAttackedByQueen(position, board, color) {
    return this.isAttackedBy(
      this.getQueenMoves(position, board, color),
      board, color, 'Q'
    );
  }

  isAttackedByRook(position, board, color) {
    return this.isAttackedBy(
      this.getRookMoves(position, board, color),
      board, color, 'R'
    );                   
  }
  
  isCheck(currentPlayer, board) {
    let attackers = [];
    let kingPos = currentPlayer === 'w' ? board.indexOf('K') : board.indexOf('k');
    
    let bishopAttackers = this.isAttackedByBishop(kingPos, board, currentPlayer);
    if (bishopAttackers.length > 0) return true;
    
    let RookAttackers = this.isAttackedByRook(kingPos, board, currentPlayer);
    if (RookAttackers.length > 0) return true;

    let KnightAttackers = this.isAttackedByKnight(kingPos, board, currentPlayer);
    if (KnightAttackers.length > 0) return true;

    let QueenAttackers = this.isAttackedByQueen(kingPos, board, currentPlayer);
    if (QueenAttackers.length > 0) return true;

    let KingAttackers = this.isAttackedByKing(kingPos, board, currentPlayer);
    if (KingAttackers.length > 0) return true;

    let PawnAttackers = this.isAttackedByPawn(kingPos, board, currentPlayer);
    if (PawnAttackers.length > 0) return true;

    return false;
  }

  isLegalMove(from, to) {
    return Boolean(this.legalMoves.includes(`${from}-${to}`));
  }

  makeMove(from, to) {
    this.specialMoves.b.enPassant = false;
    this.specialMoves.w.enPassant = false;
    switch (this.board[from]) {
      case 'K':
        this.specialMoves.w.kingSideCastle = false;
        this.specialMoves.w.queenSideCastle = false;
        if (Math.abs(from - to) === 2) {
          this.castle(from, to);
        }
        break;
      case 'k':
        this.specialMoves.b.kingSideCastle = false;
        this.specialMoves.b.queenSideCastle = false;
        if (Math.abs(from - to) === 2) {
          this.castle(from, to);
        }
        break;

      case 'R':
        if (from == 81) {
          this.specialMoves.w.queenSideCastle = false;
        } else if (from == 88){
          this.specialMoves.w.kingSideCastle = false;
        }
        break;

      case 'r':
        if (from == 11) {
          this.specialMoves.b.queenSideCastle = false;
        } else if (from == 18){
          this.specialMoves.b.kingSideCastle = false;
        }
        break;

      case 'P':
        if (Math.abs(from - to) === 20) {
          this.specialMoves.b.enPassant = to;
        }
        break;

      case 'p':
        if (Math.abs(from - to) === 20) {
        this.specialMoves.w.enPassant = to;
        }
      break;
    
      default:
        break;
    }
    this.board = this.updateBoard(this.board, to, this.board[from]);
    this.board = this.updateBoard(this.board, from, '-');
    this.currentTurn = this.currentTurn === 'w' ? 'b' : 'w';
    this.findLegalMoves();
  }

  testMove(move, board) {
    let from = move.split('-')[0];
    let to = move.split('-')[1];
    let placePiece = this.updateBoard(board, to, board[from]);
    let removePiece = this.updateBoard(placePiece, from, '-');
    return removePiece;
  }

  updateBoard(board, pos, replacement) {
    return board.substr(0, parseInt(pos)) + replacement + board.substr(parseInt(pos) + 1);
  }
};