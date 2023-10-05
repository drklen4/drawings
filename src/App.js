import React from "react";

const controller = {
    'ArrowLeft': false,
    'ArrowRight': false,
    'q': false,
    'e': false
}

const handleKeyDown = (event) => {
    switch(event.key) {
        case 'ArrowLeft':
            controller['ArrowLeft'] = true;
            break;
        case 'ArrowRight':
            controller['ArrowRight'] = true;
            break;
        case 'q':
            controller['q'] = true;
            break;
        case 'e':
            controller['e'] = true;
            break;
    }
}

const handleKeyUp = (event) => {
    switch(event.key) {
        case 'ArrowLeft':
            controller['ArrowLeft'] = false;
            break;
        case 'ArrowRight':
            controller['ArrowRight'] = false;
            break;
        case 'q':
            controller['q'] = false;
            break;
        case 'e':
            controller['e'] = false;
            break;
    }
}



class App extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        canvas.width = window.innerWidth - 40;
        canvas.height = window.innerHeight - 40;
        const {paddle1, paddle2} = this.props;

        console.log('listener Key Down added!')
        document.addEventListener('keydown', (event) => handleKeyDown(event));

        console.log('listener Key Up added!')
        document.addEventListener('keyup', (event) => handleKeyUp(event));

        this.drawBalls();
    }

    componentDidUpdate() {
        const canvas = this.canvasRef.current;
        canvas.width = window.innerWidth;

        this.drawBalls();
    }

    drawBalls() {
        const {balls, paddle1, paddle2, stopGame} = this.props;
        const canvas = this.canvasRef.current;
        canvas.width = window.innerWidth - 40;
        canvas.height = window.innerHeight - 40;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);


        //draw paddles
        paddle1.y = canvas.height - 10;
        paddle2.y = 0;

        context.fillStyle = paddle1.color;
        context.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
        context.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
        context.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
        context.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

        // draw text players info
        context.fillStyle = `rgb(17, 17, 17)`;
        context.font = `20px Verdana`;
        context.fillText('Player 1', canvas.width - 300, canvas.height - 80);
        context.fillText('Player 2', canvas.width - 300, 80);

        // move paddles
        function movePaddlesIfNeeded() {
            if (controller['ArrowLeft']) {
                paddle1.x = paddle1.x - 2
                paddle1.x = (paddle1.x < 0) ? 0 : (paddle1.x);
            } else if (controller['ArrowRight']) {
                paddle1.x = paddle1.x + 2
                paddle1.x = (paddle1.x + paddle1.width > canvas.width) ? (canvas.width - paddle1.width) : (paddle1.x)
            }

            if (controller['q']) {
                paddle2.x = paddle2.x - 2
                paddle2.x = (paddle2.x < 0) ? 0 : (paddle2.x);
            } else if (controller['e']) {
                paddle2.x = paddle2.x + 2
                paddle2.x = (paddle2.x + paddle2.width > canvas.width) ? (canvas.width - paddle2.width) : (paddle2.x)
            }
        }

        balls.forEach(ball => {
            context.fillStyle = ball.color;
            context.beginPath();
            context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
            context.closePath();
            context.fill();


            // bounce from walls and paddles
            function doBounceIfNeeded() {
                let rightTouch = ball.x >= canvas.width - ball.radius;
                let bottomTouch = (ball.y + ball.radius >= canvas.height - ball.radius) && (ball.x >= paddle1.x) && (ball.x <= paddle1.x + paddle1.width);
                let leftTouch = ball.x <= ball.radius;
                let topTouch = (ball.y - paddle2.height <= ball.radius) && (ball.x >= paddle2.x) && (ball.x <= paddle2.x + paddle2.width);

                if (rightTouch || leftTouch) {
                    ball.toRight = !ball.toRight;
                }
                if (bottomTouch || topTouch) {
                    ball.toBottom = !ball.toBottom;
                }
                if (ball.y - ball.radius > canvas.height + 5) {
                    stopGame[0] = true;
                } else if (ball.y + ball.radius < -5) {
                    stopGame[1] = true;
                }
            }

            // move ball and check if bounce from walls is needed
            if (ball.toRight && ball.toBottom) {
                ball.x += ball.dx;
                ball.y += ball.dy;
                if (
                    canvas.width - ball.x <= ball.radius ||
                    canvas.height - paddle1.height - ball.y <= ball.radius
                ) {
                    doBounceIfNeeded();
                }
            } else if (!ball.toRight && ball.toBottom) {
                ball.x -= ball.dx;
                ball.y += ball.dy;
                if (
                    ball.x <= ball.radius ||
                    canvas.height - paddle1.height - ball.y <= ball.radius
                ) {
                    doBounceIfNeeded();
                }
            } else if (!ball.toRight && !ball.toBottom) {
                ball.x -= ball.dx;
                ball.y -= ball.dy;
                if (
                    ball.x <= ball.radius ||
                    ball.y - paddle2.height <= ball.radius
                ) {
                    doBounceIfNeeded();
                }
            } else if (ball.toRight && !ball.toBottom) {
                ball.x += ball.dx;
                ball.y -= ball.dy;

                if (
                    canvas.width - ball.x <= ball.radius ||
                    ball.y - paddle2.height <= ball.radius
                ) {
                    doBounceIfNeeded();
                }
            }
        });
        movePaddlesIfNeeded();
    }

    render() {
        return <canvas className="canvas" ref={this.canvasRef}></canvas>;
    }
}

export default App;