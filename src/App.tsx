import { Stage } from "@inlet/react-pixi";
import EasingGraph from "./EasingGraphComponent";
import {
  EasingFunction,
  EasingGraphStyle,
  ExamplePosition,
} from "./EasingGraph";
import "./App.css";
import React, { ReactNode, useState } from "react";
import pkg from "../package.json";

const poly = (exp: number) => (x: number) => x ** exp;
const cubic = poly(3);
const quintic = poly(5);
const scale =
  (s: number) =>
  (f: EasingFunction): EasingFunction =>
  (x) =>
    f(x * s);
const scaleOutput =
  (s: number) =>
  (f: EasingFunction): EasingFunction =>
  (x) =>
    f(x) * s;
const offsetX =
  (offset: number) =>
  (f: EasingFunction): EasingFunction =>
  (x) =>
    f(x - offset);
const offsetY =
  (y: number) =>
  (f: EasingFunction): EasingFunction =>
  (x) =>
    f(x) + y;
const K = (k: number) => (_: number) => k;
const I = (x: number) => x;
const thresh = (threshold: number) => (x: number) => x < threshold ? 0 : 1;
const reflectX = (f: EasingFunction) => (x: number) => f(1 - x);
const reflectY = (f: EasingFunction) => (x: number) => 1 - f(x);
const reflectXY = (f: EasingFunction) => reflectX(reflectY(f));
const easeOut = reflectXY;
const blend = (a: EasingFunction, b: EasingFunction) => (x: number) =>
  a(x) * (1 - x) + b(x) * x;
const split =
  (a: EasingFunction, b: EasingFunction): EasingFunction =>
  (x) =>
    x < 0.5 ? a(x) : b(x);
const easeInOut = (f: EasingFunction) =>
  scaleOutput(0.5)(
    split(scale(2)(f), offsetX(0.5)(offsetY(1)(scale(2)(easeOut(f)))))
  );
const mirror = (f: EasingFunction): EasingFunction =>
  split(scale(2)(f), reflectX(scale(2)(f)));
const sine = (freq: number) => (x: number) =>
  Math.sin(x * freq * Math.PI * 2) / 2 + 0.5;
const overshoot = blend(
  quintic,
  (x: number) => (2 * sine(0.35)(x) - 1) * (1 / Math.sin(0.35 * Math.PI * 2))
);

const fs = {
  linear: I,
  "linear +0.5": offsetY(0.5)(I),
  "linear ⨉2": scale(2)(I),
  "cubic x^3": cubic,
  "cubic out": easeOut(cubic),
  "cubic in out": easeInOut(cubic),
  "quintic x^5": quintic,
  "quintic flipped": reflectX(quintic),
  sine: sine(2),
  "sine + linear": reflectXY(blend(I, sine(2.25))),
  rand: (_: number) => Math.random(),
  const: K(0.5),
  thresh: thresh(0.5),
  "clamped quadratic": (x: number) => Math.max(0.1, Math.min(0.8, poly(2)(x))),
  mirror: mirror(I),
  overshoot,
};
const secondFunctions: Record<string, EasingFunction | undefined> = {
  none: undefined,
  linear: fs.linear,
  cubic: fs["cubic x^3"],
  sine: fs.sine,
};
const styles: Record<string, EasingGraphStyle> = {
  Dot: "dot",
  Line: "line",
  Fill: "fill",
};

type ToggleButtonProps = {
  value: boolean;
  setter: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode | string;
};
const ToggleButton = ({ children, value, setter }: ToggleButtonProps) => (
  <button className={value ? "selected" : ""} onClick={() => setter(!value)}>
    {children}
  </button>
);

const cycleBetween =
  <T,>(a: T, b: T, c: T) =>
  (input: T) =>
    input === a ? b : input === b ? c : a;

function App() {
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [f, setF] = useState<EasingFunction>(() => fs["cubic in out"]);
  const [f2, setF2] = useState<EasingFunction | undefined>(() => undefined);
  const [style, setStyle] = useState<EasingGraphStyle>("line");
  const [clamp, setClamp] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [trails, setTrails] = useState(false);
  const [showExample, setShowExample] = useState(true);
  const [showValues, setShowValues] = useState(false);
  const [position, setPosition] = useState<ExamplePosition>("bottom");
  const [play, setPlay] = useState(0);
  const [loop, setLoop] = useState(false);
  const [duration, setDuration] = useState(2000);

  const replay = () => setPlay((play + 1) % 2);
  const functionMap = Object.entries(fs);
  const secondFunctionMap = Object.entries(secondFunctions);
  const styleMap = Object.entries(styles);

  return (
    <div className="App">
      <h1>
        pixi-easing-graph<span className="version"> v{pkg.version}</span>
      </h1>
      <p className="description">{pkg.description}</p>
      <div>
        <a
          style={{ display: "block" }}
          href="https://github.com/mimshwright/pixi-easing-graph"
        >
          View On GitHub
        </a>
      </div>

      <Stage
        width={425}
        height={425}
        options={{
          resolution: 2,
          backgroundColor: isDarkMode ? 0x000000 : 0xffffff,
          backgroundAlpha: 0,
        }}
      >
        <EasingGraph
          f={f2 ? [f, { f: f2, foreground: 0x66ffcc }] : f}
          play={play}
          style={style}
          dotSize={3}
          lineWidth={2}
          steps={80}
          clamp={clamp}
          x={50}
          y={50}
          width={300}
          height={300}
          background={isDarkMode ? 0x333333 : showGrid ? 0xeeffff : 0xffffff}
          backgroundAlpha={1.0}
          foreground={isDarkMode ? 0xccddff : 0x0066ff}
          fillAlpha={0.5}
          markerColor={0xff44cc}
          markerSize={8}
          showExample={showExample}
          exampleColor={0xff44cc}
          exampleSize={25}
          examplePosition={position}
          exampleTrail={trails}
          markerTrail={trails}
          showValues={showValues}
          gridCount={showGrid ? 10 : 0}
          gridColor={isDarkMode ? 0x6600ff : 0xccddff}
          gridSubdivisions={true}
          duration={duration}
          loop={loop}
          autoPlay={true}
        ></EasingGraph>
      </Stage>
      <div className="functions">
        <div>
          <h2>Functions</h2>
          {functionMap.map(([key, value]) => (
            <button
              className={value === f ? "selected" : ""}
              key={key}
              onClick={() => setF(() => value)}
            >
              {key}
            </button>
          ))}{" "}
          |&nbsp;
          <ToggleButton value={clamp} setter={setClamp}>
            Clamp Values?
          </ToggleButton>
        </div>
      </div>

      <div className="columns">
        <div>
          <h2>Graph styles</h2>
          {styleMap.map(([key, value]) => (
            <button
              className={value === style ? "selected" : ""}
              key={key}
              onClick={() => setStyle(() => value)}
            >
              {key}
            </button>
          ))}
          <div>
            <ToggleButton value={showGrid} setter={setShowGrid}>
              Show Grid
            </ToggleButton>
            <ToggleButton value={showValues} setter={setShowValues}>
              Show Values
            </ToggleButton>
            <ToggleButton value={showExample} setter={setShowExample}>
              Show Example
            </ToggleButton>
            {showExample && (
              <ToggleButton value={trails} setter={setTrails}>
                Show Trails
              </ToggleButton>
            )}
            {showExample && (
              <button
                onClick={() =>
                  setPosition(
                    cycleBetween<ExamplePosition>(
                      "both",
                      "bottom",
                      "right"
                    )(position)
                  )
                }
              >
                {"Example Pos. "}
                <span className="selected">{`${position}`}</span>
              </button>
            )}
          </div>
        </div>
        <div>
          <h2>Second Function</h2>
          {secondFunctionMap.map(([key, value]) => (
            <button
              className={value === f2 ? "selected" : ""}
              key={key}
              onClick={() => setF2(() => value)}
            >
              {key}
            </button>
          ))}
        </div>
        <div>
          <h2>Animations</h2>
          <ToggleButton value={loop} setter={setLoop}>
            Loop animations
          </ToggleButton>
          <button
            onClick={() => setDuration(cycleBetween(2000, 4000, 500)(duration))}
          >
            {"Animation speed "}
            <span className="selected">
              {duration === 2000 ? "med" : duration === 500 ? "fast" : "slow"}
            </span>
          </button>
          <button onClick={replay}>Replay 🔄</button>
        </div>
      </div>
    </div>
  );
}

export default App;
