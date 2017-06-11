const Board = require('./Board.js');

const pieceMap = {
  'r': '<span class="b" style="color: darkred">♜</span>',
  'n': '<span class="b" style="color: darkred">♞</span>',
  'b': '<span class="b" style="color: darkred">♝</span>',
  'q': '<span class="b" style="color: darkred">♛</span>',
  'k': '<span class="b" style="color: darkred">♚</span>',
  'p': '<span class="b" style="color: darkred">♟</span>',
  '-': '',
  'R': '<span class="w" style="color: lightseagreen">♜</span>',
  'N': '<span class="w" style="color: lightseagreen">♞</span>',
  'B': '<span class="w" style="color: lightseagreen">♝</span>',
  'Q': '<span class="w" style="color: lightseagreen">♛</span>',
  'K': '<span class="w" style="color: lightseagreen">♚</span>',
  'P': '<span class="w" style="color: lightseagreen">♟</span>'
};

const posMap = {
  'a8': 0,  'b8': 1,  'c8': 2,  'd8': 3,  'e8': 4,  'f8': 5,  'g8': 6,  'h8': 7,  'a7': 8,  'b7': 9, 
  'c7': 10, 'd7': 11, 'e7': 12, 'f7': 13, 'g7': 14, 'h7': 15, 'a6': 16, 'b6': 17, 'c6': 18, 'd6': 19, 
  'e6': 20, 'f6': 21, 'g6': 22, 'h6': 23, 'a5': 24, 'b5': 25, 'c5': 26, 'd5': 27, 'e5': 28, 'f5': 29, 
  'g5': 30, 'h5': 31, 'a4': 32, 'b4': 33, 'c4': 34, 'd4': 35, 'e4': 36, 'f4': 37, 'g4': 38, 'h4': 39, 
  'a3': 40, 'b3': 41, 'c3': 42, 'd3': 43, 'e3': 44, 'f3': 45, 'g3': 46, 'h3': 47, 'a2': 48, 'b2': 49, 
  'c2': 50, 'd2': 51, 'e2': 52, 'f2': 53, 'g2': 54, 'h2': 55, 'a1': 56, 'b1': 57, 'c1': 58, 'd1': 59, 
  'e1': 60, 'f1': 61, 'g1': 62, 'h1': 63
};

module.exports = class Game {
  constructor(user) {
    this.users = {
      [user.id]: {
        user: user,
        color: 'w'
      }
    };
    this.currentTurn = user.id;
    this.board = new Board();
  }

  generateHtml(user) {
    let boardRepresentation = this.board.getBoard();
    let color = this.users[user.id].color;
    return `
      <script>
        var playerColor = '${color}';
        var currentPlayer = '${this.currentTurn}' === '${user.id}';

        var firstMove = function(pColor, cPlayer) {
          $('.chess-board div').each(function(idx) {
            var availableMove = cPlayer && $(this).children().attr('class') === pColor;

            if (availableMove) {
              $(this).css({
                border: 'none',
                cursor: 'pointer'
              })
            } else {
              $(this).css({
                cursor: 'default'
              });
            }

            $(this).off().click(function() {
              if (availableMove) {
                var input;
                if ($('form input').val() == '') {
                  input = '\/chess -' +  $(this).attr('id');
                  $(this).css({
                    border: '2px solid green'
                  });
                  $('form input').val(input);
                  secondMove(pColor, cPlayer);
                }
              } else {
                $('form input').val('');
              }
            });
          });
        }

        var secondMove = function(pColor, cPlayer) {
          $('.chess-board div').each(function(idx) {
            var availableMove = cPlayer && $(this).children().attr('class') !== pColor;

            if (availableMove) {
              $(this).css({
                border: 'none',
                cursor: 'pointer'
              })
            } else {
              $(this).css({
                cursor: 'default'
              });
            }
            $(this).off().click(function() {
              if (availableMove) {
                var input;
                if ($('form input').val().split(' -').length == 2) {
                  input = $('form input').val() + ' -' + $(this).attr('id');
                  $('form input').val(input);
                  $('form').submit();
                }
              } else {
                $('form input').val('');
                firstMove(pColor, cPlayer);
              }
            });
          });
        }

        firstMove(playerColor, currentPlayer);
      </script>
      <style>
        ul.chess-board { display: flex; flex-flow: column; justify-content: center; height: 100%; width: 100%; background-color: midnightblue; border-radius: 8% }
        .chess-board li { display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100% }
        .chess-board li.bottom { margin-left: 1.5vw }
        .chess-board li span.left { width: 3vw; text-align: center; font-weight: bold; background-color:seagreen; line-height: 3vw }
        .chess-board li div { box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw }
        .chess-board li span.bottom { font-weight: bold; width: 3vw; text-align:center; background-color:seagreen; line-height: 3vw }
        @media screen and (max-device-width: 480px) {
          ul.chess-board { display: flex; flex-flow: column; justify-content: center; height: 100%; width: 100%; background-color: midnightblue; border-radius: 8% }
          .chess-board li { display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100% }
          .chess-board li.bottom { margin-left: 1.5vw }
          .chess-board li span.left { width: 3vw; text-align: center; font-weight: bold; background-color:seagreen; line-height: 3vw }
          .chess-board li div { box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw }
          .chess-board li span.bottom { font-weight: bold; width: 3vw; text-align:center; background-color:seagreen; line-height: 3vw }
        }
      </style>
      <ul class="chess-board">
        <li>
          <span class="left" style="border-top-left-radius: 50%"> 8 </span>
          <div id="a8" style="background-color:white">${pieceMap[boardRepresentation[0]]}</div>
          <div id="b8"  style="background-color:black">${pieceMap[boardRepresentation[1]]}</div>
          <div id="c8"  style="background-color:white">${pieceMap[boardRepresentation[2]]}</div>
          <div id="d8"  style="background-color:black">${pieceMap[boardRepresentation[3]]}</div>
          <div id="e8"  style="background-color:white">${pieceMap[boardRepresentation[4]]}</div>
          <div id="f8"  style="background-color:black">${pieceMap[boardRepresentation[5]]}</div>
          <div id="g8"  style="background-color:white">${pieceMap[boardRepresentation[6]]}</div>
          <div id="h8"  style="background-color:black">${pieceMap[boardRepresentation[7]]}</div>
        </li>
        <li>
          <span class="left"> 7 </span>
          <div id="a7" style="background-color:black">${pieceMap[boardRepresentation[8]]}</div>
          <div id="b7" style="background-color:white">${pieceMap[boardRepresentation[9]]}</div>
          <div id="c7" style="background-color:black">${pieceMap[boardRepresentation[10]]}</div>
          <div id="d7" style="background-color:white">${pieceMap[boardRepresentation[11]]}</div>
          <div id="e7" style="background-color:black">${pieceMap[boardRepresentation[12]]}</div>
          <div id="f7" style="background-color:white">${pieceMap[boardRepresentation[13]]}</div>
          <div id="g7" style="background-color:black">${pieceMap[boardRepresentation[14]]}</div>
          <div id="h7" style="background-color:white">${pieceMap[boardRepresentation[15]]}</div>
        </li>
        <li>
          <span class="left"> 6 </span>
          <div id="a6" style="background-color:white">${pieceMap[boardRepresentation[16]]}</div>
          <div id="b6" style="background-color:black">${pieceMap[boardRepresentation[17]]}</div>
          <div id="c6" style="background-color:white">${pieceMap[boardRepresentation[18]]}</div>
          <div id="d6" style="background-color:black">${pieceMap[boardRepresentation[19]]}</div>
          <div id="e6" style="background-color:white">${pieceMap[boardRepresentation[20]]}</div>
          <div id="f6" style="background-color:black">${pieceMap[boardRepresentation[21]]}</div>
          <div id="g6" style="background-color:white">${pieceMap[boardRepresentation[22]]}</div>
          <div id="h6" style="background-color:black">${pieceMap[boardRepresentation[23]]}</div>
        </li>
        <li>
          <span class="left"> 5 </span>
          <div id="a5" style="background-color:black">${pieceMap[boardRepresentation[24]]}</div>
          <div id="b5" style="background-color:white">${pieceMap[boardRepresentation[25]]}</div>
          <div id="c5" style="background-color:black">${pieceMap[boardRepresentation[26]]}</div>
          <div id="d5" style="background-color:white">${pieceMap[boardRepresentation[27]]}</div>
          <div id="e5" style="background-color:black">${pieceMap[boardRepresentation[28]]}</div>
          <div id="f5" style="background-color:white">${pieceMap[boardRepresentation[29]]}</div>
          <div id="g5" style="background-color:black">${pieceMap[boardRepresentation[30]]}</div>
          <div id="h5" style="background-color:white">${pieceMap[boardRepresentation[31]]}</div>
        </li>
        <li>
          <span class="left"> 4 </span>
          <div id="a4" style="background-color:white">${pieceMap[boardRepresentation[32]]}</div>
          <div id="b4" style="background-color:black">${pieceMap[boardRepresentation[33]]}</div>
          <div id="c4" style="background-color:white">${pieceMap[boardRepresentation[34]]}</div>
          <div id="d4" style="background-color:black">${pieceMap[boardRepresentation[35]]}</div>
          <div id="e4" style="background-color:white">${pieceMap[boardRepresentation[36]]}</div>
          <div id="f4" style="background-color:black">${pieceMap[boardRepresentation[37]]}</div>
          <div id="g4" style="background-color:white">${pieceMap[boardRepresentation[38]]}</div>
          <div id="h4" style="background-color:black">${pieceMap[boardRepresentation[39]]}</div>
        </li>
        <li>
          <span class="left"> 3 </span>
          <div id="a3" style="background-color:black">${pieceMap[boardRepresentation[40]]}</div>
          <div id="b3" style="background-color:white">${pieceMap[boardRepresentation[41]]}</div>
          <div id="c3" style="background-color:black">${pieceMap[boardRepresentation[42]]}</div>
          <div id="d3" style="background-color:white">${pieceMap[boardRepresentation[43]]}</div>
          <div id="e3" style="background-color:black">${pieceMap[boardRepresentation[44]]}</div>
          <div id="f3" style="background-color:white">${pieceMap[boardRepresentation[45]]}</div>
          <div id="g3" style="background-color:black">${pieceMap[boardRepresentation[46]]}</div>
          <div id="h3" style="background-color:white">${pieceMap[boardRepresentation[47]]}</div>
        </li>
        <li>
          <span class="left"> 2 </span>
          <div id="a2" style="background-color:white">${pieceMap[boardRepresentation[48]]}</div>
          <div id="b2" style="background-color:black">${pieceMap[boardRepresentation[49]]}</div>
          <div id="c2" style="background-color:white">${pieceMap[boardRepresentation[50]]}</div>
          <div id="d2" style="background-color:black">${pieceMap[boardRepresentation[51]]}</div>
          <div id="e2" style="background-color:white">${pieceMap[boardRepresentation[52]]}</div>
          <div id="f2" style="background-color:black">${pieceMap[boardRepresentation[53]]}</div>
          <div id="g2" style="background-color:white">${pieceMap[boardRepresentation[54]]}</div>
          <div id="h2" style="background-color:black">${pieceMap[boardRepresentation[55]]}</div>
        </li>
        <li>
          <span class="left"> 1 </span>
          <div id="a1" style="background-color:black">${pieceMap[boardRepresentation[56]]}</div>
          <div id="b1" style="background-color:white">${pieceMap[boardRepresentation[57]]}</div>
          <div id="c1" style="background-color:black">${pieceMap[boardRepresentation[58]]}</div>
          <div id="d1" style="background-color:white">${pieceMap[boardRepresentation[59]]}</div>
          <div id="e1" style="background-color:black">${pieceMap[boardRepresentation[60]]}</div>
          <div id="f1" style="background-color:white">${pieceMap[boardRepresentation[61]]}</div>
          <div id="g1" style="background-color:black">${pieceMap[boardRepresentation[62]]}</div>
          <div id="h1" style="background-color:white">${pieceMap[boardRepresentation[63]]}</div>
        </li>
        <li class="bottom">
          <span class="bottom"> A </span>
          <span class="bottom"> B </span>
          <span class="bottom"> C </span>
          <span class="bottom"> D </span>
          <span class="bottom"> E </span>
          <span class="bottom"> F </span>
          <span class="bottom"> G </span>
          <span class="bottom" style="border-bottom-right-radius: 50%"> H </span>
        </li>
      </ul>
    `;
  }

  hasOpenSpot() {
    return (Object.keys(this.users).length < 2);
  }

  joinGame(user) {
    this.users[user.id] = {
      user: user,
      color: 'w'
    };
  }

  makeMove(user, from, to, sendMessage, render) {
    if (this.currentTurn === user.id) {
      if (this.board.isLegalMove(posMap[from], posMap[to])) {
        this.board.makeMove(posMap[from], posMap[to]);
        for (let player in this.users) {
          if (this.users.hasOwnProperty(player)) {
            this.renderBoard(this.users[player].user,render);
          }
        }
      } else {
        sendMessage('That is not a valid move.', 'red', false, user);
        this.renderBoardState(user,render);
      }
    } else {
      sendMessage('It is not your turn to move.', 'red', false, user);
    }
  }

  renderBoardState(user, render) {
    let html = this.generateHtml(user);
    render({
      user: user,
      html: html
    });
  }

  watchGame(user) {
    this.users[user.id] = {
      user: user,
      color: 'v'
    };
  }
};