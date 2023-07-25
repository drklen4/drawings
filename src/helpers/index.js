export const ballHelper = {
    getAngle() {
        let angle;
        do {
            angle = Math.floor(Math.random() * 360);
        } while (Math.cos(angle) <= 0.5 || Math.sin(angle) <= 0.5);

        return angle;
    },
    getColor() {
        return `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
            Math.random() * 255
        )},${Math.floor(Math.random() * 255)}`;
    },
    getRadius() {
        return Math.floor(Math.random() * 50) + 10;
    }
};