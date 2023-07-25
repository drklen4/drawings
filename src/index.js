import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';
import Ball from './components/Ball';
import { ballHelper } from './helpers';

const balls = [new Ball(ballHelper.getColor(), ballHelper.getRadius(), ballHelper.getAngle(), 3)];

// draw balls
setInterval(() => {
    ReactDOM.render(<App balls={balls} />, document.getElementById('root'));
});

// add ball
let counter = 0;
let addBallInterval = setInterval(() => {
    balls.push(new Ball(ballHelper.getColor(), ballHelper.getRadius(), ballHelper.getAngle(), 3));
    counter++;
    if (counter === 20) {
        clearInterval(addBallInterval);
    }
}, 5000);
