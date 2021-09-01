
function hashContains(s) {
  return !!window.location.hash.match(s);
}

const sketch = (p) => {
  p.canvasSide = () => {
    return Math.min(p.windowWidth, p.windowHeight);
  }

  let params = {
    numRays: 24,
    numPoints: 24,
    duration: 5,

  }

  let outputEl;
  const printParams = () => {
    outputEl.elt.innerHTML = JSON.stringify(params, null, 2);
  }

  p.setup = () => {
    p.createCanvas(p.canvasSide(), p.canvasSide())
    p.background(255);
    // p.colorMode(p.HSB, 1, 1, 1, 1)

    outputEl = p.createP();
    outputEl.style('font-family', 'monospace');
    outputEl.style('white-space', 'pre');

    let gif;
    if (hashContains("gif")) {
      console.log("gif enabled");
      gif = {
        options: { quality: 1 },
        fileName: "bloc-out.gif",
        startLoop: 1,
        endLoop: 2,
        download: hashContains("download"),
        open: hashContains("open"),
      };
    }
    p.frameRate(30);
    p.createLoop({
      gif,
      duration: params.duration,
    });
  }


  p.draw = () => {
    const w = p.width;
    const h = p.height;
    p.background(255);
    for (let i = 0; i < params.numPoints; i++) {
      const th = (i * Math.PI * 2) / params.numPoints;
      const x = w / 2 + (3 * (Math.sin(th) * w)) / 4;
      const y = h / 2 + (3 * (Math.cos(th) * h)) / 4;

      p.push();
      p.translate(x, y);
      for (let j = 0; j < params.numRays; j++) {
        const th2 =
          p.animLoop.theta / (params.numRays) + (2 * Math.PI * j) / params.numRays;
        // const color = p.color(((p.animLoop.progress) + j / params.numRays) / 2, 0.3, 0.9);
        const color = p.color(0.5, 0.5, 0.9);
        p.stroke(0);
        p.strokeWeight(2);
        p.push();
        p.rotate(th2);
        // for (let lp = 0; lp < p.width * 2; lp += 20) {
        //   p.point(lp, 0);
        // }
        p.line(0, 0, 1000, 100)
        p.line(0, 0, 1000, -100)
        p.pop();
      }
      p.pop();
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.canvasSide(), p.canvasSide());
    console.log('resized');
  }
};

new p5(sketch, document.body)

