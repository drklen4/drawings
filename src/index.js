import React from 'react';
import ReactDOM from "react-dom/client";
import './App.css';
import App from './App';
import Ball from './components/Ball';
import {ballHelper} from './helpers';
import Square from "./components/Square";

const balls = [new Ball(`rgb(2, 44, 181)`, 20, ballHelper.getAngle(), 2, 220)];

const squares = [];
const stopGame = [];
stopGame.push(false);

for (let i=0; i<20; i++) {
    squares.push(new Square(0, 0, 0))
}
const rowNumber = 2;


const paddle = new Square(150, 900, 550);
paddle.height = 10;
paddle.color = `rgb(2, 160, 255)`;

// draw balls
const root= ReactDOM.createRoot(document.getElementById("root"));
var refreshIntervalId = setInterval(() => {
    root.render(<App balls={balls} squares = {squares} rowNumber = {rowNumber} paddle={paddle} stopGame={stopGame}/>);

    if (squares.filter(s => s.visible).length === 0) {
        alert('You won!')
        clearInterval(refreshIntervalId);
    }

    if (stopGame[0]) {
        alert("You lose!");
        clearInterval(refreshIntervalId);
    }
});




