import {BspNode} from './bsp.js';
import {upPressed, downPressed, leftPressed, rightPressed} from './input.js';
import {Vertex, Sidedef, Linedef, Seg, Map} from './map.js';
import {CANVAS_WIDTH, CANVAS_HEIGHT, canvasShiftX, canvasShiftY, canvas, ctx, t, Camera, Render} from './render.js';


let v
//engine object
let Engine = {

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

};



//main loop exit
function exitMainLoop() {
    clearInterval(intervalId);
};

//MAIN LOOP
function mainLoop() {

Render.fillScreen('black');


Engine.currentMap.bspTree.traverseBspTree(Engine.currentCamera, Render.renderSeg);


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