import { PixiComponent } from "@inlet/react-pixi";
import { Sprite, Graphics } from "pixi.js";
import { apply, times, zip } from "ramda";

type Point = [number, number];
export type EasingFunction = (x: number) => number;

export type EasingGraphStyle = "dot" | "line" | "fill";

export interface EasingGraphOptions {
  width: number;
  height: number;
  background: number;
  foreground: number;
  gridColor: number;
  style: EasingGraphStyle;
  dotSize: number;
  gridCount: number;
  steps?: number;
}

export type EasingGraphProps = {
  f: EasingFunction;
  x?: number;
  y?: number;
} & Partial<EasingGraphOptions>;

const defaultOptions: EasingGraphOptions = {
  width: 250,
  height: 250,
  style: "dot",
  dotSize: 2,
  background: 0xffffff,
  foreground: 0x000000,
  gridColor: 0xcccccc,
  gridCount: 0,
};

class EasingGraph extends Sprite {
  f: EasingFunction;
  graphics: Graphics;
  options: EasingGraphOptions;

  static defaultOptions = defaultOptions;

  constructor(f: EasingFunction, options: Partial<EasingGraphOptions> = {}) {
    super();
    this.f = f;
    this.graphics = new Graphics();
    this.addChild(this.graphics);
    this.options = { ...defaultOptions, ...options };

    this.draw();
  }

  draw() {
    const g = this.graphics;
    const { width, height, style, background, dotSize, gridCount } =
      this.options;
    const steps = this.options.steps ?? width / dotSize;

    const inputs = times((n) => n / (steps - 1), steps);
    const outputs = inputs.map(this.f);
    const coords: Point[] = zip(inputs, outputs);
    const coordToPixel = ([x, y]: Point): Point => [
      x * width,
      height - y * height,
    ];
    const pixelCoords: Point[] = coords.map(coordToPixel);

    g.clear();
    g.beginFill(background);
    g.drawRect(0, 0, width, height);
    g.endFill();

    if (gridCount > 0) {
      this.drawGrid();
    }

    const drawFunctions = {
      line: this.drawLines,
      fill: this.drawFill,
      dot: this.drawDots,
    };
    drawFunctions[style].call(this, pixelCoords);
  }

  drawDots(coords: Point[]) {
    const { foreground, dotSize } = this.options;
    const g = this.graphics;
    const drawDot = (x: number, y: number) => g.drawCircle(x, y, dotSize);

    g.beginFill(foreground);
    coords.map(apply(drawDot));
    g.endFill();
  }
  drawLines(coords: Point[]) {
    const { foreground } = this.options;
    const g = this.graphics;
    const drawLine = apply(g.lineTo.bind(g));

    g.lineStyle(1, foreground);
    coords.map(drawLine);
    g.lineStyle();
  }
  drawFill(coords: Point[]) {
    const { foreground, width, height } = this.options;
    const g = this.graphics;
    const drawLine = apply(g.lineTo.bind(g));

    g.moveTo(0, height);
    g.beginFill(foreground);
    coords.map(drawLine);
    g.lineTo(width, 0);
    g.lineTo(width, height);
    g.lineTo(0, height);
    g.endFill();
    g.closePath();
  }

  drawGrid() {
    const g = this.graphics;
    const { width, height, gridCount, gridColor } = this.options;

    g.lineStyle(1, gridColor);
    const drawGridLines = (pos: number) => {
      g.moveTo(0, (pos / gridCount) * height);
      g.lineTo(width, (pos / gridCount) * height);
      g.closePath();
      g.moveTo((pos / gridCount) * width, 0);
      g.lineTo((pos / gridCount) * width, height);
      g.closePath();
    };
    times(drawGridLines, gridCount);
    g.lineStyle();
  }
}
export default EasingGraph;
