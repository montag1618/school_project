const CANVAS_WIDTH = 1500;
const CANVAS_HEIGHT = 726;

const canvasShiftX = Math.floor(CANVAS_WIDTH/2);
const canvasShiftY = Math.floor(CANVAS_HEIGHT/2);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const t = Math.trunc

class Camera {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.direction = dir;
    };
};

export {CANVAS_WIDTH, CANVAS_HEIGHT, canvasShiftX, canvasShiftY, canvas, ctx, t};