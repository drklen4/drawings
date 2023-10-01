import React from "react";

const handleKeyDown = (event, paddle, width) => {
    if (event.key === 'ArrowLeft') {
        paddle.x = paddle.x - 20
        paddle.x = (paddle.x < 0) ? 0 : (paddle.x);
    } else if (event.key === 'ArrowRight') {
        paddle.x = paddle.x + 20
        paddle.x = (paddle.x + paddle.width > width) ? (width - paddle.width) : (paddle.x)
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

        // set squares width and x
        const {squares, rowNumber, paddle} = this.props;
        let oneRowLength = squares.length / rowNumber;
        let width = canvas.width / oneRowLength;

        for (let j = 0; j < rowNumber; j++) {
            for (let i = 0; i < oneRowLength; i++) {
                squares[i + j * oneRowLength].x = i * width;
                squares[i + j * oneRowLength].width = width;
                squares[i + j * oneRowLength].y = squares[i + j * oneRowLength].y + j * squares[i + j * oneRowLength].height;
            }
        }

        console.log('listenerAdded!')
        document.addEventListener('keydown', (event) => handleKeyDown(event, paddle, canvas.width));

        this.drawBalls();
    }

    componentDidUpdate() {
        const {paddle} = this.props;
        const canvas = this.canvasRef.current;
        canvas.width = window.innerWidth;


        this.drawBalls();
    }

    drawBalls() {
        const {balls, squares, rowNumber, paddle, stopGame} = this.props;
        const canvas = this.canvasRef.current;
        canvas.width = window.innerWidth - 40;
        canvas.height = window.innerHeight - 40;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);


        // draw squares
        squares.forEach(square => {
            if (square.visible) {
                context.fillStyle = square.color;
                context.strokeRect(square.x, square.y, square.width, square.height);
                context.fillRect(square.x, square.y, square.width, square.height);
            }
        })

        //draw paddle
        paddle.y = canvas.height - 10;
        context.fillStyle = paddle.color;
        context.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
        context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);


        balls.forEach(ball => {
            context.fillStyle = ball.color;
            context.beginPath();
            context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
            context.closePath();
            context.fill();

            //other balls
            let balls2 = balls.filter(ball2 => {
                return ball !== ball2
            }).map(ballToMap => ballToMap);


            // bounce from walls
            function doBounceIfNeeded() {
                let rightTouch = ball.x >= canvas.width - ball.radius;
                let bottomTouch = (ball.y >= canvas.height - ball.radius) && (ball.x >= paddle.x) && (ball.x <= paddle.x + paddle.width);
                let leftTouch = ball.x <= ball.radius;
                let topTouch = ball.y <= ball.radius;

                if (rightTouch || leftTouch) {
                    ball.toRight = !ball.toRight;
                }
                if (bottomTouch || topTouch) {
                    ball.toBottom = !ball.toBottom;
                }
                if (ball.y - ball.radius > canvas.height + 5) {
                    stopGame[0] = true;
                }
            }


            // move ball and check if bounce from walls is needed
            if (ball.toRight && ball.toBottom) {
                ball.x += ball.dx;
                ball.y += ball.dy;
                if (
                    canvas.width - ball.x <= ball.radius ||
                    canvas.height - paddle.height - ball.y <= ball.radius
                ) {
                    doBounceIfNeeded();
                }
            } else if (!ball.toRight && ball.toBottom) {
                ball.x -= ball.dx;
                ball.y += ball.dy;
                if (
                    ball.x <= ball.radius ||
                    canvas.height - paddle.height - ball.y <= ball.radius
                ) {
                    doBounceIfNeeded();
                }
            } else if (!ball.toRight && !ball.toBottom) {
                ball.x -= ball.dx;
                ball.y -= ball.dy;
                if (
                    ball.x <= ball.radius ||
                    ball.y <= ball.radius
                ) {
                    doBounceIfNeeded();
                }
            } else if (ball.toRight && !ball.toBottom) {
                ball.x += ball.dx;
                ball.y -= ball.dy;

                if (
                    canvas.width - ball.x <= ball.radius ||
                    ball.y <= ball.radius
                ) {
                    doBounceIfNeeded();
                }
            }

            // bounce from square
            let closestSquareByX = squares.find(square => (ball.x >= square.x) && (ball.x < square.x + square.width) && (square.y === square.height * (rowNumber - 1)))
            if (closestSquareByX && closestSquareByX.visible && (ball.y - ball.radius <= closestSquareByX.y + closestSquareByX.height) && (!ball.toBottom)) {
                ball.toBottom = true;
                closestSquareByX.visible = false;
            } else {
                let closestSquareBySide = squares.find(square => (
                        (ball.x + ball.radius >= square.x) &&
                        (ball.x - ball.radius <= square.x + square.width) &&
                        (ball.y >= square.y) &&
                        (ball.y <= square.y + square.height)
                    )
                )

                if (closestSquareBySide && closestSquareBySide.visible && (ball.y - ball.radius <= closestSquareBySide.y + closestSquareBySide.height)) {
                    ball.toRight = !ball.toRight;
                    closestSquareBySide.visible = false;
                }
            }
        });
    }

    render() {
        return <canvas className="canvas" ref={this.canvasRef}></canvas>;
    }
}

export default App;