import { Sprite, Graphics, Texture, Ticker, TickerCallback } from "pixi.js";
import { apply, times, zip, clamp, identity } from "ramda";

type Point = [number, number];
export type EasingFunction = (x: number) => number;

export type EasingGraphStyle = "dot" | "line" | "fill";
export type ExamplePosition = "bottom" | "right" | "both";
export interface EasingGraphOptions {
  width: number;
  height: number;
  steps: number;
  style: EasingGraphStyle;
  clamp: boolean;
  background: number;
  foreground: number;
  fillAlpha: number;
  showMarker: boolean;
  markerColor: number;
  markerSize: number;
  exampleColor: number;
  exampleSize: number;
  examplePosition: ExamplePosition;
  exampleTrail: boolean;
  dotSize: number;
  gridColor: number;
  gridCount: number;
  gridSubdivisions: boolean;
}

const ticker = Ticker.shared;

const defaultOptions: EasingGraphOptions = {
  width: 250,
  height: 250,
  style: "dot",
  clamp: false,
  steps: NaN,
  dotSize: 2,
  background: 0xffffff,
  foreground: 0x000000,
  fillAlpha: 0.5,
  showMarker: true,
  markerColor: 0xff0000,
  markerSize: 10,
  exampleColor: 0x333333,
  exampleSize: 50,
  examplePosition: "bottom",
  exampleTrail: false,
  gridCount: 10,
  gridColor: 0xcccccc,
  gridSubdivisions: true,
  // TODO: Add animation properties
};

const clamp01 = clamp(0, 1);

class EasingGraph extends Sprite {
  f: EasingFunction;
  graphics: Graphics;
  trail: Graphics;
  options: EasingGraphOptions;

  isPlaying: boolean = false;
  marker: Marker;
  exampleX: Marker;
  exampleY: Marker;
  t: number = 0;
  duration: number = 2000;

  static defaultOptions = defaultOptions;

  constructor(f: EasingFunction, options: Partial<EasingGraphOptions> = {}) {
    super();
    this.f = f;
    this.options = { ...defaultOptions, ...options };

    this.graphics = new Graphics();
    this.addChild(this.graphics);

    this.trail = new Graphics();
    this.addChild(this.trail);

    const { markerSize, markerColor, exampleColor, exampleSize } = this.options;

    this.marker = new Marker(markerColor, markerSize);
    this.marker.visible = false;
    this.addChild(this.marker);

    this.exampleX = new Marker(exampleColor, exampleSize);
    this.exampleX.visible = false;
    this.exampleX.x = 0;
    this.exampleX.y = this.options.height + exampleSize * 1.5;
    this.addChild(this.exampleX);

    this.exampleY = new Marker(exampleColor, exampleSize);
    this.exampleY.visible = false;
    this.exampleY.x = this.options.width + exampleSize * 1.5;
    this.exampleY.y = this.options.height;
    this.addChild(this.exampleY);
  }

  play() {
    this.stop();

    const { showMarker, examplePosition } = this.options;

    if (showMarker) this.marker.visible = true;

    this.exampleY.visible = this.exampleX.visible = true;
    if (examplePosition === "bottom") this.exampleY.visible = false;
    if (examplePosition === "right") this.exampleX.visible = false;

    this.trail.clear();
    this.t = 0;

    this.isPlaying = true;
    ticker.add<EasingGraph>(this.animationStep, this);
  }
  stop() {
    ticker.remove<EasingGraph>(this.animationStep, this);
    this.isPlaying = false;
  }

  private animationStep() {
    this.t += ticker.deltaMS;
    const {
      t,
      options,
      exampleX: ex,
      exampleY: ey,
      marker,
      f,
      duration,
      trail,
    } = this;
    const { clamp, width, height, exampleTrail, dotSize, foreground } = options;

    const clampFunction = clamp ? clamp01 : identity;

    const x = t / duration;
    const y = clampFunction(f(x));

    marker.x = x * width;
    marker.y = height - y * height;

    if (ex.visible) ex.x = y * width;
    if (ey.visible) ey.y = marker.y;

    if (exampleTrail) {
      const g = trail;
      g.beginFill(foreground);
      if (ex.visible) g.drawCircle(ex.x, ex.y, dotSize);
      if (ey.visible) g.drawCircle(ey.x, ey.y, dotSize);
      g.endFill();
    }

    if (t > duration) {
      this.stop();
    }
  }
  draw() {
    const g = this.graphics;
    const {
      width,
      height,
      style,
      background,
      steps: stepsOrNaN,
      gridCount,
      clamp,
    } = this.options;
    const steps = isNaN(stepsOrNaN) ? width : stepsOrNaN;

    const clampFunction = clamp ? clamp01 : identity;

    const inputs = times((n) => n / (steps - 1), steps);
    const outputs = inputs
      .map(this.f)
      // clamp values?
      .map(clampFunction);
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
    const { foreground, height } = this.options;
    const g = this.graphics;
    const drawLine = apply(g.lineTo.bind(g));

    g.moveTo(0, height);
    g.lineStyle(1, foreground);
    coords.map(drawLine);
    g.lineStyle();
  }
  drawFill(coords: Point[]) {
    const { foreground, fillAlpha, width, height } = this.options;
    const g = this.graphics;
    const drawLine = apply(g.lineTo.bind(g));

    g.moveTo(0, height);
    g.beginFill(foreground, fillAlpha);
    coords.map(drawLine);
    g.lineTo(width, 0);
    g.lineTo(width, height);
    g.lineTo(0, height);
    g.endFill();
    g.closePath();
  }

  drawGrid() {
    const g = this.graphics;
    const { width, height, gridCount, gridColor, gridSubdivisions } =
      this.options;

    g.lineStyle(1, gridColor);
    const drawGridLines = (pos: number) => {
      g.lineStyle(1, gridColor);
      if (
        (gridSubdivisions && pos === 0) ||
        pos === gridCount ||
        (pos === gridCount / 2 && gridCount % 2 === 0)
      ) {
        g.lineStyle(2, gridColor);
        g.lineStyle(2, gridColor);
      }

      g.moveTo(0, (pos / gridCount) * height);
      g.lineTo(width, (pos / gridCount) * height);
      g.closePath();
      g.moveTo((pos / gridCount) * width, 0);
      g.lineTo((pos / gridCount) * width, height);
      g.closePath();
    };
    times(drawGridLines, gridCount + 1);
    g.lineStyle();
  }
}
export default EasingGraph;

class Marker extends Sprite {
  color: number;
  size: number;
  graphics: Graphics;

  constructor(color: number, size: number, texture?: Texture) {
    super(texture);
    this.color = color;
    this.size = size;
    this.graphics = new Graphics();
    this.addChild(this.graphics);
    this.anchor.set(0.5);

    this.draw();
  }
  draw() {
    const { graphics: g, color, size } = this;
    g.clear();
    g.beginFill(color);
    g.drawCircle(0, 0, size);
    g.endFill();
  }
}
