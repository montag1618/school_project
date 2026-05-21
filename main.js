import {BspNode} from './bsp.js';
import {upPressed, downPressed, leftPressed, rightPressed} from './input.js';
import {Vertex, Sidedef, Linedef, Seg, Map} from './map.js';
import {CANVAS_WIDTH, CANVAS_HEIGHT, canvasShiftX, canvasShiftY, canvas, ctx, t, Camera} from './render.js';


let v
//engine object
let Engine  = {

    currentMap: new Map(
        v = [
        new Vertex(700, 300),
        new Vertex(-700, 300),
        new Vertex(-700, -300),
        new Vertex(700, -300),

        new Vertex(-500, 200),
        new Vertex(-350, 200),
        new Vertex(-350, 50),
        new Vertex(-500, 50),

        new Vertex(600, -50),
        new Vertex(400, -50),
        new Vertex(500, 100),

        new Vertex(50, 50),
        new Vertex(150, 150),
        ],[
        new Linedef(v[0], v[1]),
        new Linedef(v[1], v[2]),
        new Linedef(v[2], v[3]),
        new Linedef(v[3], v[0]),

        new Linedef(v[4], v[5]),
        new Linedef(v[5], v[6]),
        new Linedef(v[6], v[7]),
        new Linedef(v[7], v[4]),

        new Linedef(v[8], v[9]),
        new Linedef(v[9], v[10]),
        new Linedef(v[10], v[8]),

        new Linedef(v[11], v[12]),
        ]
    ),

    currentCamera: new Camera(0, 0, 0),

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



//main loop exit
function exitMainLoop() {
    clearInterval(intervalId);
};

//MAIN LOOP
function mainLoop() {

ctx.fillStyle = "black";
ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


Engine.currentMap.bspTree.traverseBspTree(Engine.currentCamera, Engine.renderSeg);


//move camera
if (upPressed) {
    Engine.currentCamera.x += Math.cos(Engine.currentCamera.direction) * 4;
    Engine.currentCamera.y += Math.sin(Engine.currentCamera.direction) * 4;
};

if (downPressed) {
    Engine.currentCamera.x -= Math.cos(Engine.currentCamera.direction) * 2;
    Engine.currentCamera.y -= Math.sin(Engine.currentCamera.direction) * 2;
};

if (leftPressed) Engine.currentCamera.direction += 0.1;
if (rightPressed) Engine.currentCamera.direction -= 0.1;

};

const intervalId = setInterval(mainLoop, 20);