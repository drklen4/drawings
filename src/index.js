import React from 'react';
import ReactDOM from "react-dom/client";
import './App.css';
import App from './App';
import Ball from './components/Ball';
import {ballHelper} from './helpers';
import Square from "./components/Square";

const balls = [new Ball(`rgb(2, 44, 181)`, 20, ballHelper.getAngle(), 2, 220)];

const stopGame = [];
stopGame.push(false);
stopGame.push(false);

const paddle1 = createPaddle();
const paddle2 = createPaddle();

// draw balls
const root= ReactDOM.createRoot(document.getElementById("root"));
const refreshIntervalId = setInterval(() => {
    root.render(<App balls={balls} paddle1={paddle1} paddle2={paddle2} stopGame={stopGame}/>);

    for (let i = 0; i < stopGame.length; i++) {
        if (stopGame[i]) {
            alert("Player " + (i + 1) + " lose!");
            clearInterval(refreshIntervalId);
        }
    }
});

function createPaddle() {
    const paddle = new Square(150, 900, 550);
    paddle.height = 10;
    paddle.color = `rgb(2, 160, 255)`;
    return paddle;
}


