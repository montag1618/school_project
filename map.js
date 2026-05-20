import { BspNode } from "./bsp.js";

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

export {Vertex, Sidedef, Linedef, Seg, Map};