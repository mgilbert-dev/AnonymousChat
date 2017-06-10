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

module.exports = class Game {
  constructor(user) {
    this.users = {
      [user.id]: {
        user: user,
        color: 'w'
      }
    };
    this.currentTurn = user;
    this.board = new Board();
  }

  generateHtml(user) {
    let boardRepresentation = this.board.getBoard();
    let color = this.users[user.id].color;
    return `
      <script>
        var playerColor = '${color}';
        var currentPlayer = '${this.currentTurn.id}' === '${user.id}';

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
      <ul class="chess-board" style="display: flex; flex-flow: column; justify-content: center; height: 100%; width: 100%; background-color: midnightblue; border-radius: 8%">
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:seagreen; line-height: 3vw; border-top-left-radius: 50%"> 8 </span>
          <div id="a8" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[0]]}</div>
          <div id="b8"  style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[1]]}</div>
          <div id="c8"  style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[2]]}</div>
          <div id="d8"  style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[3]]}</div>
          <div id="e8"  style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[4]]}</div>
          <div id="f8"  style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[5]]}</div>
          <div id="g8"  style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[6]]}</div>
          <div id="h8"  style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[7]]}</div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:seagreen; line-height: 3vw"> 7 </span>
          <div id="a7" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[8]]}</div>
          <div id="b7" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[9]]}</div>
          <div id="c7" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[10]]}</div>
          <div id="d7" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[11]]}</div>
          <div id="e7" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[12]]}</div>
          <div id="f7" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[13]]}</div>
          <div id="g7" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[14]]}</div>
          <div id="h7" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[15]]}</div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:seagreen; line-height: 3vw"> 6 </span>
          <div id="a6" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[16]]}</div>
          <div id="b6" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[17]]}</div>
          <div id="c6" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[18]]}</div>
          <div id="d6" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[19]]}</div>
          <div id="e6" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[20]]}</div>
          <div id="f6" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[21]]}</div>
          <div id="g6" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[22]]}</div>
          <div id="h6" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[23]]}</div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:seagreen; line-height: 3vw"> 5 </span>
          <div id="a5" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[24]]}</div>
          <div id="b5" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[25]]}</div>
          <div id="c5" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[26]]}</div>
          <div id="d5" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[27]]}</div>
          <div id="e5" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[28]]}</div>
          <div id="f5" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[29]]}</div>
          <div id="g5" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[30]]}</div>
          <div id="h5" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[31]]}</div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:seagreen; line-height: 3vw"> 4 </span>
          <div id="a4" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[32]]}</div>
          <div id="b4" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[33]]}</div>
          <div id="c4" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[34]]}</div>
          <div id="d4" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[35]]}</div>
          <div id="e4" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[36]]}</div>
          <div id="f4" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[37]]}</div>
          <div id="g4" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[38]]}</div>
          <div id="h4" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[39]]}</div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:seagreen; line-height: 3vw"> 3 </span>
          <div id="a3" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[40]]}</div>
          <div id="b3" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[41]]}</div>
          <div id="c3" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[42]]}</div>
          <div id="d3" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[43]]}</div>
          <div id="e3" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[44]]}</div>
          <div id="f3" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[45]]}</div>
          <div id="g3" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[46]]}</div>
          <div id="h3" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[47]]}</div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:seagreen; line-height: 3vw"> 2 </span>
          <div id="a2" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[48]]}</div>
          <div id="b2" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[49]]}</div>
          <div id="c2" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[50]]}</div>
          <div id="d2" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[51]]}</div>
          <div id="e2" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[52]]}</div>
          <div id="f2" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[53]]}</div>
          <div id="g2" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[54]]}</div>
          <div id="h2" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[55]]}</div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:seagreen; line-height: 3vw"> 1 </span>
          <div id="a1" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[56]]}</div>
          <div id="b1" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[57]]}</div>
          <div id="c1" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[58]]}</div>
          <div id="d1" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[59]]}</div>
          <div id="e1" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[60]]}</div>
          <div id="f1" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[61]]}</div>
          <div id="g1" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:black">${pieceMap[boardRepresentation[62]]}</div>
          <div id="h1" style="box-sizing: border-box; display: flex; justify-content: center; align-items; center; font-size:2.5vw; width:3vw; height:3vw; background-color:white">${pieceMap[boardRepresentation[63]]}</div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%; margin-left: 1.5vw">
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:seagreen; line-height: 3vw"> A </span>
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:seagreen; line-height: 3vw"> B </span>
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:seagreen; line-height: 3vw"> C </span>
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:seagreen; line-height: 3vw"> D </span>
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:seagreen; line-height: 3vw"> E </span>
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:seagreen; line-height: 3vw"> F </span>
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:seagreen; line-height: 3vw"> G </span>
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:seagreen; line-height: 3vw; border-bottom-right-radius: 50%"> H </span>
        </li>
      </ul>
    `;
  }
};