const Board = require('./Board.js');

module.exports = class Game {
  constructor(user) {
    this.users = {
      [user.id]: user
    };
    this.board = new Board();
  }

  generateHtml() {
    return `
      <ul style="display: flex; flex-flow: column; justify-content: center; height: 100%; width: 100%; background-color: midnightblue; border-radius: 50px">
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:#4caf50; line-height: 3vw; border-top-left-radius: 50%"> 8 </span>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:#4caf50; line-height: 3vw"> 7 </span>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:#4caf50; line-height: 3vw"> 6 </span>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:#4caf50; line-height: 3vw"> 5 </span>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:#4caf50; line-height: 3vw"> 4 </span>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:#4caf50; line-height: 3vw"> 3 </span>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:#4caf50; line-height: 3vw"> 2 </span>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black; "></div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%">
          <span style="width: 3vw; text-align: center; font-weight: bold; background-color:#4caf50; line-height: 3vw"> 1 </span>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:black"></div>
          <div style="box-sizing: content-box; display: inline-block; width:3vw; height:3vw; background-color:white"></div>
        </li>
        <li style="display: flex; flex-flow: row; justify-content: center; line-height: 3vw; height: 3vw; width: 100%; margin-left: 1.5vw">
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:#4caf50; line-height: 3vw"> A </span>
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:#4caf50; line-height: 3vw"> B </span>
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:#4caf50; line-height: 3vw"> C </span>
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:#4caf50; line-height: 3vw"> D </span>
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:#4caf50; line-height: 3vw"> E </span>
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:#4caf50; line-height: 3vw"> F </span>
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:#4caf50; line-height: 3vw"> G </span>
          <span style="font-weight: bold; width: 3vw; text-align:center; background-color:#4caf50; line-height: 3vw; border-bottom-right-radius: 50%"> 8 </span>
        </li>
      </ul>
    `;
  }
};