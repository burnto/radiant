const queryString = require('query-string');

const duration = 3;
const fps = 30;

const queryParams = queryString.parse(location.search, { parseNumbers: true, parseBooleans: true });
let params = Object.assign({}, {
  numRays: 6,
  numPoints: 6,
  color: "#669999",
  strokeWeight: 1.0,
  gif: false,
  open: true,
}, queryParams);
console.log(params);

const sketch = (p) => {
  p.canvasSide = () => {
    return Math.min(600, Math.min(p.windowWidth, p.windowHeight));
  }

  const mutateParams = () => {
    let choice = Math.random();
    if (choice > 0.75) {
      params.numRays += 1;
    } else if (choice > 0.5) {
      params.numPoints += 2
    } else if (choice > 0.25) {
      params.strokeWeight = params.strokeWeight * 0.9;
    } else {
      if (!params.color.startsWith("#")) {
        params.color = `#${params.color}`
      }
      let color = p.color(params.color);
      let m = Math.random() > 0.1 ? -20 : 20;
      let i = Math.floor(Math.random() * 4);
      let levels = color.levels;
      levels[i] = Math.max(0, Math.min(255, levels[i] + m));
      console.log(levels);
      params.color = p.color(...levels).toString("#rrggbb")

    }
    printParams();
  }

  let outputEl;
  const printParams = () => {
    outputEl.elt.innerHTML = JSON.stringify(params, null, 2);
  }

  p.setup = () => {
    p.createCanvas(p.canvasSide(), p.canvasSide())
    p.background(255);
    p.noFill();

    outputEl = p.createP();
    outputEl.style('font-family', 'monospace');
    outputEl.style('white-space', 'pre');

    let b = p.createButton('mutate');
    b.mousePressed(mutateParams);


    let gif;
    console.log("download", params.download);
    if (params.gif) {
      const open = !params.download;
      console.log(`gif enabled, will be ${open ? 'opened in tab' : 'downloaded'}`);
      gif = {
        options: { quality: 9 },
        fileName: "bloc-out.gif",
        startLoop: 1,
        endLoop: 3,
        download: params.download,
        open,
      };
    }
    p.frameRate(fps);
    p.createLoop({
      gif,
      duration,
    });
    // console.log(p.animLoop.onPostRender);

    // p.animLoop.onPreRender.addListener(x => {
    //   console.log("prerender")
    // })
    // p.animLoop.onPostRender.addListener(x => {
    // console.log("postrender")
    // })
    console.log(p.animLoop);

    printParams();
  }


  p.draw = () => {
    let m = 0.75 + Math.sin(p.animLoop.theta) / 8;
    const w = p.width;
    const h = p.height;
    p.background(255);
    for (let i = 0; i < params.numPoints; i++) {
      const th = (i * Math.PI * 2) / params.numPoints;
      const x = w / 2 + (Math.sin(th) * w) * .5;
      const y = h / 2 + (Math.cos(th) * h) * .5;


      p.push();
      p.translate(x, y);
      for (let j = 0; j < params.numRays; j++) {
        const th2 =
          p.animLoop.theta / (params.numRays) + (2 * Math.PI * j) / params.numRays;
        // const color = p.color(0.5, 0.5, 0.9);
        const color = p.color(params.color);
        p.stroke(color);
        p.strokeWeight(0.7);
        p.push();
        p.rotate(th2);
        for (var i2 = 0; i2 < 1000; i2 += 10) {
          p.line(i2 * m, 20, i2 * m, -20);
          // i2 += m;
        }
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

