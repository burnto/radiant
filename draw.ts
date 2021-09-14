import p5 from "p5";
const duration = 5;
const fps = 30;

let params = Object.assign(
  {},
  {
    numRays: 6,
    numPoints: 6,
    color: "#669999",
    strokeWeight: 1.0,
    fillOpacity: 10,
    gif: false,
    open: true,
    startLoop: 1,
    endLoop: 2,
    quality: 5,
    workers: 20,
  }
);

const numLines = 30;
const gravity = 100;
const points = [
  // [200, 200],
  // [230, 220],
  // [500, 20],
  // [20, 300],
  // [250, 280],
];

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(p.canvasSide(), p.canvasSide());
    p.frameRate(30);
    p.noFill();
  };

  function warp(x: number, y: number, pts: number[][]) {
    const warpFactor = pts
      .map((pt) => {
        return {
          pt: pt,
          vec: [x - pt[0], y - pt[1]],
          dist: p.dist(x, y, pt[0], pt[1]),
        };
      })
      .filter((e) => e.dist < gravity)
      .reduce(
        (acc, e, i) => {
          return [acc[0] + e.vec[0], acc[1] + e.vec[1]];
        },
        [0, 0]
      );
    // console.log(x, y, warpFactor);
    return [x + warpFactor[0] / 2, y + warpFactor[1] / 2];
  }

  p.draw = () => {
    const pts = [...points, [p.mouseX, p.mouseY]];

    if (p.frameCount > 1) {
      // return;
    }
    p.background(255);
    p.stroke(0);
    p.strokeWeight(2);
    for (let i = 0; i < numLines; i++) {
      let x = ((i + 1) * p.width) / numLines;
      p.beginShape();
      for (let y = -40; y < p.height + 40; y += 20) {
        // p.point(...warp(x, y));
        p.curveVertex(...warp(x, y, pts));
      }
      p.endShape();
    }
  };

  p.canvasSide = () => {
    return Math.min(600, Math.min(p.windowWidth, p.windowHeight));
  };

  p.windowResized = () => {
    p.resizeCanvas(p.canvasSide(), p.canvasSide());
    console.log("resized");
  };
};

new p5(sketch, document.body);
