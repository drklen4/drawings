export default class Ball {
    constructor(color, radius, angle, speed, y) {
        this.color = color;
        this.radius = radius;
        this.angle = angle;
        this.speed = speed;
        this.x = 0;
        this.y = y;
        this.dx = Math.cos(angle) * speed;
        this.dy = Math.sin(angle) * speed;
        this.toRight = true;
        this.toBottom = true;
        this.iteration = 0;
    }
}