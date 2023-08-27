import React from "react";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // set squares width and x
        const {squares, rowNumber} = this.props;
        let oneRowLength = squares.length / rowNumber;
        let width = canvas.width / oneRowLength;

        for (let j = 0; j < rowNumber; j++) {
            for (let i = 0; i < oneRowLength; i++) {
                squares[i+j*oneRowLength].x = i * width;
                squares[i+j*oneRowLength].width = width;
                squares[i+j*oneRowLength].y = squares[i+j*oneRowLength].y + j*squares[i+j*oneRowLength].height;
            }
        }

        this.drawBalls();
    }

    componentDidUpdate() {
        this.drawBalls();
    }

    drawBalls() {
        const {balls, squares, rowNumber} = this.props;
        const canvas = this.canvasRef.current;
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
                let bottomTouch = ball.y >= canvas.height - ball.radius;
                let leftTouch = ball.x <= ball.radius;
                let topTouch = ball.y <= ball.radius;

                if (rightTouch || leftTouch) {
                    ball.toRight = !ball.toRight;
                }
                if (bottomTouch || topTouch) {
                    ball.toBottom = !ball.toBottom;
                }
            }

            // bounce from other ball if both balls are closed and continue to get closer
            function doBounceFromOtherBall(ball2) {
                let distance = Math.sqrt(Math.pow(ball.x - ball2.x, 2) + Math.pow(ball.y - ball2.y, 2));

                if (distance <= ball.radius + ball2.radius) {
                    //supposed next distance if no bounce will happen
                    let spx1 = ball.toRight ? (ball.x + ball.dx) : (ball.x - ball.dx);
                    let spy1 = ball.toBottom ? (ball.y + ball.dy) : (ball.y - ball.dy);
                    let spx2 = ball2.toRight ? (ball2.x + ball2.dx) : (ball2.x - ball2.dx);
                    let spy2 = ball2.toBottom ? (ball2.y + ball2.dy) : (ball2.y - ball2.dy);
                    let spDistance = Math.sqrt(Math.pow(spx1 - spx2, 2) + Math.pow(spy1 - spy2, 2));

                    if (spDistance <= distance) {
                        ball.toRight = !ball.toRight;
                        ball.toBottom = !ball.toBottom;
                    }
                }
            }

            // move ball and check if bounce from walls is needed
            if (ball.toRight && ball.toBottom) {
                ball.x += ball.dx;
                ball.y += ball.dy;
                if (
                    canvas.width - ball.x <= ball.radius ||
                    canvas.height - ball.y <= ball.radius
                ) {
                    doBounceIfNeeded();
                }
            } else if (!ball.toRight && ball.toBottom) {
                ball.x -= ball.dx;
                ball.y += ball.dy;
                if (
                    ball.x <= ball.radius ||
                    canvas.height - ball.y <= ball.radius
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
            let closestSquareByX = squares.find(square => (ball.x >= square.x) && (ball.x < square.x + square.width) && (square.y === square.height*(rowNumber - 1)))
            if (closestSquareByX.visible && (ball.y - ball.radius <= closestSquareByX.y + closestSquareByX.height) && (!ball.toBottom)) {
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
                    console.log(closestSquareBySide)
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