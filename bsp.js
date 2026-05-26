import {Vertex, Sidedef, Linedef, Seg, Map} from "./map.js";

const crossPr = (x1, y1, x2, y2) => x1 * y2 - y1 * x2;

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
        if (crossPr((s.endVertex.x-s.startVertex.x), (s.endVertex.y-s.startVertex.y), (p.x-s.startVertex.x), (p.y-s.startVertex.y)) > 0) {

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

export {BspNode};