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

let Render = {

    fillScreen(color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    },

    renderMiniMap() {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            for (let l = 0; l < Engine.currentMap.linedefs.length; l++) {
                let start = Engine.currentMap.linedefs[l].startVertex;
                let end = Engine.currentMap.linedefs[l].endVertex;
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
            ctx.arc(Engine.currentCamera.x + canvasShiftX, canvasShiftY - Engine.currentCamera.y, 10, 0, 6.2830);
            ctx.moveTo(Engine.currentCamera.x + canvasShiftX, canvasShiftY - Engine.currentCamera.y);
            ctx.lineTo(Engine.currentCamera.x + Math.cos(this.currentCamera.direction)*15 + canvasShiftX, canvasShiftY - Engine.currentCamera.y - Math.sin(Engine.currentCamera.direction)*15);
            ctx.stroke();
    },

    renderSeg(seg) {
        let sx = seg.startVertex.x - Engine.currentCamera.x;
        let sy = seg.startVertex.y - Engine.currentCamera.y;
        let ex = seg.endVertex.x - Engine.currentCamera.x;
        let ey = seg.endVertex.y - Engine.currentCamera.y;

        let sin = Math.sin(-Engine.currentCamera.direction);
        let cos = Math.cos(-Engine.currentCamera.direction);

        ctx.strokeStyle = seg.texture;
        ctx.beginPath();
        ctx.moveTo((t(sx * cos) - t(sy * sin)) + canvasShiftX, canvasShiftY - (t(sy * cos) + t(sx * sin)));
        ctx.lineTo((t(ex * cos) - t(ey * sin)) + canvasShiftX, canvasShiftY - (t(ey * cos) + t(ex * sin)));
        ctx.stroke();
    },

};

export {CANVAS_WIDTH, CANVAS_HEIGHT, canvasShiftX, canvasShiftY, canvas, ctx, t, Camera, Render};