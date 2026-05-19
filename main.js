"use strict"

const CANVAS_WIDTH = 1500;
const CANVAS_HEIGHT = 726;

const canvasShiftX = Math.floor(CANVAS_WIDTH/2);
const canvasShiftY = Math.floor(CANVAS_HEIGHT/2);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const t = Math.trunc
const crossPr = (x1, y1, x2, y2) => x1 * y2 - y1 * x2;



//map classes
class Vertex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    };
};

class Sidedef {
    constructor(color) {
        this.color = color;
    };
};

class Linedef {
    constructor(startVertex, endVertex, frontSidedef, backSidedef) {
        this.startVertex = startVertex;
        this.endVertex = endVertex;
        this.frontSidedef = frontSidedef;
        this.backSidedef = backSidedef;
    };
};

class Seg {
    constructor(startVertex, endVertex, linedef, oppDirection, texture, offset) {
        this.startVertex = startVertex;
        this.endVertex = endVertex;
        this.linedef = linedef;
        this.oppDirection = oppDirection;
        this.texture = texture;
        this.offset = offset;
    };
};

class BspNode {
    leftNode = null;
    rightNode = null;
    splitters = [];
    
    splitSpace(segs, splitterIndex) {
        
        let splitters = [];

        let splitter = segs[splitterIndex];

        let splits = 0;

        let frontSegs = [];
        let backSegs = [];
        let s = splitter.startVertex;
        let vx = splitter.endVertex.x - s.x;
        let vy = splitter.endVertex.y - s.y;

        for (let seg of segs) {
            let p = seg.startVertex;
            let rx = seg.endVertex.x - p.x;
            let ry = seg.endVertex.y - p.y;
            
            let PSxV = crossPr(p.x-s.x, p.y-s.y, vx, vy);
            let VxR = crossPr(vx, vy, rx, ry);
            if (VxR == 0) {

                if (PSxV >  0) backSegs.push(seg); else
                if (PSxV < 0) frontSegs.push(seg); else
                splitters.push(seg);

            } else {
                
                let t = PSxV/VxR;
                if (t == 0) {
                    if (VxR > 0) frontSegs.push(seg);
                    else backSegs.push(seg);

                } else if (t >= 1 || t < 0) {
                    if (PSxV > 0) backSegs.push(seg);
                    else frontSegs.push(seg);
                    
                } else {
                    let nv = new Vertex(p.x + t*rx, p.y + t*ry);
                    if (PSxV > 0) {
                        frontSegs.push(new Seg(nv, seg.endVertex, seg.linedef, seg.oppDirection, seg.texture, 0));
                        backSegs.push(new Seg(p, nv, seg.linedef, seg.oppDirection, seg.texture, 0));
                    } else {
                        frontSegs.push(new Seg(p, nv, seg.linedef, seg.oppDirection, seg.texture, 0));
                        backSegs.push(new Seg(nv, seg.endVertex, seg.linedef, seg.oppDirection, seg.texture, 0));
                    };
                    splits++
                };

            };
        };

        return {frontSegs: frontSegs, backSegs: backSegs, splitters: splitters, splits: splits};

    };


    buildBspTree(segs) {

        let splittedSegs;
        let bestSplit;
        let bestScore = Infinity;
        let score;
        for (let i = 0; i < segs.length; i++) {
            splittedSegs = this.splitSpace(segs, i);
            score = splittedSegs.splits*5 + Math.abs(splittedSegs.frontSegs.length - splittedSegs.backSegs.length);
            if (score < bestScore) {
                bestScore = score;
                bestSplit = splittedSegs;
            };
        };

        this.splitters = bestSplit.splitters;

        if (bestSplit.backSegs.length > 0) {
            this.rightNode = new BspNode();
            this.rightNode.buildBspTree(bestSplit.backSegs);
        };

        if (bestSplit.frontSegs.length > 0) {
            this.leftNode = new BspNode();
            this.leftNode.buildBspTree(bestSplit.frontSegs);
        };

    };


    traverseBspTree(p, f) {

        let s = this.splitters[0];
        if (crossPr((s.endVertex.x-s.startVertex.x), (s.endVertex.y-s.startVertex.y), (p.x-s.startVertex.x), (p.y-s.startVertex.y)) < 0) {

            if (this.rightNode != null) this.rightNode.traverseBspTree(p, f);
            for (let s of this.splitters) f(s);
            if (this.leftNode != null) this.leftNode.traverseBspTree(p, f);

        } else {

            if (this.leftNode != null) this.leftNode.traverseBspTree(p, f);
            for (let s of this.splitters) f(s);
            if (this.rightNode != null) this.rightNode.traverseBspTree(p, f);

        };
    };
};

class Map {
    constructor(vertices, linedefs) {
        this.vertices = vertices;
        this.linedefs = linedefs;
        this.bspTree = new BspNode();

        let segs = [];
        let h = 0;
        for (let l of this.linedefs) {
            segs.push(new Seg(l.startVertex, l.endVertex, l, false, `hsl(${(h+=20)%360}, 100%, 50%)`, 0));
        };
        this.bspTree.buildBspTree(segs);
    };
};

//camera class
class Camera {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.direction = dir;
    };
};

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



//keyboard input processing
let upPressed, downPressed, leftPressed, rightPressed;
upPressed = downPressed = leftPressed = rightPressed = false;

document.addEventListener("keydown", function(event) {
    let key = event.code;
    switch (key) {
        case "ArrowUp" : upPressed = true; break;
        case "ArrowDown" : downPressed = true; break;
        case "ArrowLeft" : leftPressed = true; break;
        case "ArrowRight" : rightPressed = true; break;
    };
});

document.addEventListener("keyup", function(event) {
    let key = event.code;
    switch (key) {
        case "ArrowUp" : upPressed = false; break;
        case "ArrowDown" : downPressed = false; break;
        case "ArrowLeft" : leftPressed = false; break;
        case "ArrowRight" : rightPressed = false; break;
    };
});


//main loop exit
function exitMainLoop() {
    clearInterval(intervalId);
};

//MAIN LOOP
function mainLoop() {

ctx.fillStyle = "black";
ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


//renderMiniMap(testMap);

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