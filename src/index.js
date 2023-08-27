import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';
import Ball from './components/Ball';
import {ballHelper} from './helpers';
import Square from "./components/Square";

const balls = [new Ball(`rgb(2, 44, 181)`, 20, ballHelper.getAngle(), 3, 120)];

const squares = [];
for (let i=0; i<10; i++) {
    squares.push(new Square(0, 0, 0))
}

// draw balls
setInterval(() => {
    ReactDOM.render(<App balls={balls} squares = {squares}/>, document.getElementById('root'));
});


