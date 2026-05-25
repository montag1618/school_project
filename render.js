const CANVAS_WIDTH = 1500;
const CANVAS_HEIGHT = 726;

const canvasShiftX = Math.floor(CANVAS_WIDTH/2);
const canvasShiftY = Math.floor(CANVAS_HEIGHT/2);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const t = Math.trunc
const crossPr = (x1, y1, x2, y2) => x1 * y2 - y1 * x2;

class Camera {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.direction = dir;
        this.fov = 1.57;
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
            for (let l = 0; l < this.engine.currentMap.linedefs.length; l++) {
                let start = this.engine.currentMap.linedefs[l].startVertex;
                let end = this.engine.currentMap.linedefs[l].endVertex;
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
            ctx.arc(this.engine.currentCamera.x + canvasShiftX, canvasShiftY - this.engine.currentCamera.y, 10, 0, 6.2830);
            ctx.moveTo(this.engine.currentCamera.x + canvasShiftX, canvasShiftY - this.engine.currentCamera.y);
            ctx.lineTo(this.engine.currentCamera.x + Math.cos(this.engine.currentCamera.direction)*15 + canvasShiftX, canvasShiftY - this.engine.currentCamera.y - Math.sin(this.engine.currentCamera.direction)*15);
            ctx.stroke();
    },

    renderSeg(seg) {
        let sx = seg.startVertex.x - this.engine.currentCamera.x;
        let sy = seg.startVertex.y - this.engine.currentCamera.y;
        let ex = seg.endVertex.x - this.engine.currentCamera.x;
        let ey = seg.endVertex.y - this.engine.currentCamera.y;

        let sin = Math.sin(-this.engine.currentCamera.direction);
        let cos = Math.cos(-this.engine.currentCamera.direction);

        let ubogiiKostil = t(sx * cos) - t(sy * sin);
        sy = t(sy * cos) + t(sx * sin);
        sx = ubogiiKostil;
        ubogiiKostil = t(ex * cos) - t(ey * sin);
        ey = t(ey * cos) + t(ex * sin);
        ex = ubogiiKostil;
        
        let fovx1 = Math.cos(this.engine.currentCamera.fov/2)-this.engine.currentCamera.x;
        let fovy1 = Math.sin(this.engine.currentCamera.fov/2)-this.engine.currentCamera.y;
        let fovx2 = Math.cos(-this.engine.currentCamera.fov/2)-this.engine.currentCamera.x;
        let fovy2 = Math.sin(-this.engine.currentCamera.fov/2)-this.engine.currentCamera.y;
        let svecx = sx-this.engine.currentCamera.x;
        let svecy = sy-this.engine.currentCamera.y;
        let evecx = ex-this.engine.currentCamera.x;
        let evecy = ey-this.engine.currentCamera.y;
        if (crossPr(fovx1, fovy1, svecx, svecy) > 0 && crossPr(fovx1, fovy1, evecx, evecy) > 0 || crossPr(fovx2, fovy2, svecx, svecy) < 0 && crossPr(fovx2, fovy2, evecx, evecy) < 0) return;

        ctx.strokeStyle = seg.texture;
        ctx.beginPath();
        ctx.moveTo(sx + canvasShiftX, canvasShiftY - sy);
        ctx.lineTo(ex + canvasShiftX, canvasShiftY - ey);
        ctx.stroke();
    },

};

export {CANVAS_WIDTH, CANVAS_HEIGHT, canvasShiftX, canvasShiftY, canvas, ctx, t, Camera, Render};