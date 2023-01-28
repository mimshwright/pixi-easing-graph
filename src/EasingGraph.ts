import { Sprite, Graphics, Texture, Ticker, Text, TextStyle } from "pixi.js";
import {
  apply,
  times,
  zip,
  clamp,
  identity,
  defaultTo,
  prop,
  pipe,
  reverse,
} from "ramda";

type Point = [number, number];
export type EasingFunction = (x: number) => number;

export type EasingGraphStyle = "dot" | "line" | "fill";
export type ExamplePosition = "bottom" | "right" | "both";

export interface EasingFunctionOptions {
  f: EasingFunction;
  foreground?: number;
  markerColor?: number;
}
type FuncOrFuncs = EasingFunction | (EasingFunction | EasingFunctionOptions)[];
export interface EasingGraphOptions {
  width: number;
  height: number;
  steps: number;
  style: EasingGraphStyle;
  clamp: boolean;
  background: number;
  foreground: number;
  fillAlpha: number;
  backgroundAlpha: number;
  showMarker: boolean;
  markerColor: number;
  markerSize: number;
  markerTrail: boolean;
  showExample: boolean;
  exampleColor: number;
  exampleSize: number;
  examplePosition: ExamplePosition;
  exampleTrail: boolean;
  dotSize: number;
  lineWidth: number;
  showValues: boolean;
  textStyle: TextStyle & { x?: number; y?: number };
  gridColor: number;
  gridCount: number;
  gridSubdivisions: boolean;
  duration: number;
  autoPlay: boolean;
  loop: boolean;
}

const ticker = Ticker.shared;

const defaultTextStyle = { fontSize: 10, x: 5, y: 5 };

const defaultOptions: EasingGraphOptions = {
  width: 250,
  height: 250,
  style: "dot",
  clamp: false,
  steps: NaN,
  dotSize: 2,
  lineWidth: 1,
  background: 0xffffff,
  foreground: 0x000000,
  backgroundAlpha: 1.0,
  fillAlpha: 0.5,
  showMarker: true,
  markerColor: 0xff0000,
  markerSize: 10,
  markerTrail: false,
  showExample: false,
  exampleColor: 0x333333,
  exampleSize: 50,
  examplePosition: "bottom",
  exampleTrail: false,
  showValues: false,
  textStyle: {} as TextStyle,
  gridCount: 10,
  gridColor: 0xcccccc,
  gridSubdivisions: true,
  duration: 2000,
  autoPlay: false,
  loop: false,
};

const clamp01 = clamp(0, 1);
const fixed = (d: number) => (x: number) => Math.round(x * 10 ** d) / 10 ** d;

class EasingGraph extends Sprite {
  _f: EasingFunctionOptions[] = [];
  set f(f: FuncOrFuncs) {
    // Convert type of EasingFunction | (EasingFunction | EasingFunctionOptions)[] to
    // EasingFunctionOptions[];
    this._f =
      f instanceof Array
        ? f.map((f) => (typeof f === "function" ? { f } : f))
        : [{ f }];
    if (this._f.length === 0) {
      throw new Error(
        "There must be at least one easing function attached to the graph."
      );
    }
  }
  get f(): EasingFunctionOptions[] {
    return this._f;
  }

  graphics: Graphics;
  trail: Graphics;
  options: EasingGraphOptions;

  isPlaying = false;
  marker: Marker;
  exampleX: Marker;
  exampleY: Marker;
  text: Text;
  t = 0;

  static defaultOptions = defaultOptions;

  constructor(f: FuncOrFuncs, options: Partial<EasingGraphOptions> = {}) {
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

    const mergedStyle = {
      ...{ fill: options.foreground },
      ...defaultTextStyle,
      ...options.textStyle,
    };

    this.text = new Text("", mergedStyle);
    this.text.visible = false;
    this.text.x = mergedStyle.x;
    this.text.y = mergedStyle.y;
    this.addChild(this.text);
  }

  play() {
    this.stop();

    const { showMarker, showExample, examplePosition, showValues } =
      this.options;

    this.marker.visible = showMarker;
    this.exampleY.visible = this.exampleX.visible = showExample;
    this.text.visible = showValues;

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

  private updateText(x: number, y: number) {
    const decimals = fixed(3);
    this.text.text = `x: ${decimals(x)}\ny: ${decimals(y)}`;
  }

  private animationStep() {
    this.t += ticker.deltaMS;
    const { options, exampleX: ex, exampleY: ey, marker, trail } = this;
    const {
      clamp,
      width,
      height,
      exampleTrail,
      markerTrail,
      dotSize,
      foreground,
      duration,
      loop,
      style,
      showValues,
    } = options;

    this.t = Math.min(this.t, duration);
    const t = this.t;

    const clampFunction = clamp ? clamp01 : identity;

    const f = this.f[0].f;
    const x = t / duration;
    const y = clampFunction(f(x));

    marker.x = x * width;
    marker.y = height - y * height;

    if (ex.visible) ex.x = y * width;
    if (ey.visible) ey.y = marker.y;

    const g = trail;
    g.beginFill(foreground);
    if (exampleTrail) {
      if (ex.visible) g.drawCircle(ex.x, ex.y, dotSize);
      if (ey.visible) g.drawCircle(ey.x, ey.y, dotSize);
    }
    if (markerTrail && style !== "dot") {
      if (marker.visible) g.drawCircle(marker.x, marker.y, dotSize);
    }
    g.endFill();

    if (showValues) {
      this.updateText(x, y);
    }

    if (t >= duration) {
      this.stop();
      if (loop) {
        this.play();
        this.draw();
      }
    }
  }
  draw() {
    const g = this.graphics;
    const {
      width,
      height,
      style,
      foreground,
      background,
      backgroundAlpha,
      steps: stepsOrNaN,
      gridCount,
      clamp,
      autoPlay,
    } = this.options;
    const steps = isNaN(stepsOrNaN) ? width : stepsOrNaN;

    const clampFunction = clamp ? clamp01 : identity;

    // reverse so that the last functions are drawn first.
    const fs = reverse(this.f);
    const inputs = times((n) => n / (steps - 1), steps);
    const outputs = fs.map((f: EasingFunctionOptions) =>
      inputs
        .map(f.f)
        // clamp values?
        .map(clampFunction)
    );
    const coords: Point[][] = outputs.map((fOutputs) => zip(inputs, fOutputs));
    const coordToPixel = ([x, y]: Point): Point => [
      x * width,
      height - y * height,
    ];
    const pixelCoords: Point[][] = coords.map((fCoords) =>
      fCoords.map(coordToPixel)
    );
    const foregroundColors = fs.map(
      pipe(prop("foreground"), defaultTo(foreground))
    );
    const drawParams = zip(pixelCoords, foregroundColors);

    g.clear();
    g.beginFill(background, backgroundAlpha);
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
    drawParams.map((params) => drawFunctions[style].apply(this, params));

    if (autoPlay && this.isPlaying === false) {
      this.play();
    }
  }

  drawDots(coords: Point[], foreground: number) {
    const { dotSize } = this.options;
    const g = this.graphics;
    const drawDot = (x: number, y: number) => g.drawCircle(x, y, dotSize);

    g.beginFill(foreground);
    coords.map(apply(drawDot));
    g.endFill();
  }
  drawLines(coords: Point[], foreground: number) {
    const { height, lineWidth } = this.options;
    const g = this.graphics;
    const drawLine = apply(g.lineTo.bind(g));

    g.moveTo(0, height);
    g.lineStyle(lineWidth, Math.floor(foreground));
    coords.map(drawLine);
    g.lineStyle();
  }
  drawFill(coords: Point[], foreground: number) {
    const { fillAlpha, width, height } = this.options;
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
