import p5 from 'p5';

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
  }
}

new p5(sketch, document.body)