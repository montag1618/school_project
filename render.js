const CANVAS_WIDTH = 1500;
const CANVAS_HEIGHT = 726;

const canvasShiftX = Math.floor(CANVAS_WIDTH/2);
const canvasShiftY = Math.floor(CANVAS_HEIGHT/2);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const t = Math.trunc
const crossPr = (x1, y1, x2, y2) => x1 * y2 - y1 * x2;

class Camera {
    setFov(fov) {
        this.fov = fov;
        this.d = CANVAS_WIDTH/(Math.tan(this.fov/2)*2);
    };

    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.direction = dir;
        this.setFov(1.57);
    };
};

let Render = {

    engine: null, 

    fillScreen(color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    },

    renderMiniMap() {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            for (let l = 0; l < Render.engine.currentMap.linedefs.length; l++) {
                let start = Render.engine.currentMap.linedefs[l].startVertex;
                let end = Render.engine.currentMap.linedefs[l].endVertex;
                ctx.moveTo(
                    start.x + canvasShiftX,
                    canvasShiftY - start.y
                );
                ctx.lineTo(
                    end.x + canvasShiftX,
                    canvasShiftY - end.y
                );
                ctx.moveTo(
                    t((end.x-start.x)/2)+start.x + canvasShiftX,
                    canvasShiftY - (t((end.y-start.y)/2)+start.y)
                );
                ctx.lineTo(
                    (t((end.x-start.x)/2 - (end.y-start.y)/Math.sqrt((end.x-start.x)**2 + (end.y-start.y)**2)*10)+start.x) + canvasShiftX,
                    canvasShiftY - (t((end.y-start.y)/2 + (end.x-start.x)/Math.sqrt((end.x-start.x)**2 + (end.y-start.y)**2)*10)+start.y)
                );
            };
            ctx.stroke();
    
            ctx.strokeStyle = "green";
            ctx.beginPath();
            ctx.arc(Render.engine.currentCamera.x + canvasShiftX, canvasShiftY - Render.engine.currentCamera.y, 10, 0, 6.2830);
            ctx.moveTo(Render.engine.currentCamera.x + canvasShiftX, canvasShiftY - Render.engine.currentCamera.y);
            ctx.lineTo(Render.engine.currentCamera.x + Math.cos(Render.engine.currentCamera.direction)*15 + canvasShiftX, canvasShiftY - Render.engine.currentCamera.y - Math.sin(Render.engine.currentCamera.direction)*15);
            ctx.stroke();
    },

    renderSeg(seg) {
        let sx = seg.startVertex.x - Render.engine.currentCamera.x;
        let sy = seg.startVertex.y - Render.engine.currentCamera.y;
        let ex = seg.endVertex.x - Render.engine.currentCamera.x;
        let ey = seg.endVertex.y - Render.engine.currentCamera.y;

        let sin = Math.sin(-Render.engine.currentCamera.direction);
        let cos = Math.cos(-Render.engine.currentCamera.direction);

        let ubogiiKostil = t(sx * cos) - t(sy * sin);
        sy = t(sy * cos) + t(sx * sin);
        sx = ubogiiKostil;
        ubogiiKostil = t(ex * cos) - t(ey * sin);
        ey = t(ey * cos) + t(ex * sin);
        ex = ubogiiKostil;
        
        let fovx1 = Math.cos(Render.engine.currentCamera.fov/2);
        let fovy1 = Math.sin(Render.engine.currentCamera.fov/2);
        let fovx2 = Math.cos(-Render.engine.currentCamera.fov/2);
        let fovy2 = Math.sin(-Render.engine.currentCamera.fov/2);
        if ((sx<0 || ex<0) || (crossPr(fovx1, fovy1, sx, sy) > 0 && crossPr(fovx1, fovy1, ex, ey) > 0) || (crossPr(fovx2, fovy2, sx, sy) < 0 && crossPr(fovx2, fovy2, ex, ey)) < 0) return;
        
        let r = crossPr(sx, sy, ex-sx, ey-sy)/crossPr(fovx1, fovy1, ex-sx, ey-sy);
        let u = crossPr(sx, sy, fovx1, fovy1)/crossPr(ex-sx, ey-sy, fovx1, fovy1);
        /*if (crossPr(fovx1, fovy1, ex-sx, ey-sy) != 0 && 0 <= r <= 1 && 0 <= u <= 1) {
            if (crossPr(sx, sy, fovx1, fovy1)>0) {
                sx = fovx1*r;
                sy = fovy1*r;
            } else {
                ex = fovx1*r;
                ey = fovy1*r;
            };
        };
        r = crossPr(sx, sy, ex-sx, ey-sy)/crossPr(fovx2, fovy2, ex-sx, ey-sy);
        u = crossPr(sx, sy, fovx2, fovy2)/crossPr(ex-sx, ey-sy, fovx2, fovy2);
        if ((crossPr(fovx2, fovy2, ex-sx, ey-sy) != 0) && (0 <= r <= 1) && (0 <= u <= 1)) {
            if (crossPr(sx, sy, fovx2, fovy2)<0) {
                sx = fovx2*r;
                sy = fovy2*r;
            } else {
                ex = fovx2*r;
                ey = fovy2*r;
            };
        };*/
        
        let x1 = -Render.engine.currentCamera.d * sy / sx;
        let x2 = -Render.engine.currentCamera.d * ey / ex;
        let h1 = Render.engine.currentCamera.d * 40 / sx;
        let h2 = Render.engine.currentCamera.d * 40 / ex;

        ctx.strokeStyle = seg.texture;
        ctx.beginPath();
        ctx.moveTo(x1 + canvasShiftX, canvasShiftY - h1);
        ctx.lineTo(x2 + canvasShiftX, canvasShiftY - h2);
        ctx.lineTo(x2 + canvasShiftX, canvasShiftY + h2);
        ctx.lineTo(x1 + canvasShiftX, canvasShiftY + h1);
        ctx.lineTo(x1 + canvasShiftX, canvasShiftY - h1);
        ctx.fill();
        ctx.stroke();
        /*
        ctx.strokeStyle = seg.texture;
        ctx.beginPath();
        ctx.moveTo(sx + canvasShiftX, canvasShiftY - sy);
        ctx.lineTo(ex + canvasShiftX, canvasShiftY - ey);
        ctx.stroke();*/
    },

};

export {CANVAS_WIDTH, CANVAS_HEIGHT, canvasShiftX, canvasShiftY, canvas, ctx, t, Camera, Render};