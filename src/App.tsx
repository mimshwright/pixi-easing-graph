import { Stage, Text } from "@inlet/react-pixi";
import EasingGraph from "./EasingGraphComponent";
import {
  EasingFunction,
  EasingGraphStyle,
  ExamplePosition,
} from "./EasingGraph";
import "./App.css";
import React, { ReactChildren, useState } from "react";

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
  "cubic (x^3)": cubic,
  "cubic out": easeOut(cubic),
  "cubic in out": easeInOut(cubic),
  "quintic (x^5)": quintic,
  "quintic flipped": reflectX(quintic),
  sine: sine(2),
  "sine blend": reflectXY(blend(I, sine(2.25))),
  rand: (x: number) => Math.random(),
  const: K(0.5),
  thresh: thresh(0.5),
  "clamped quadratic": (x: number) => Math.max(0.1, Math.min(0.8, poly(2)(x))),
  mirror: mirror(I),
  overshoot,
};
const styles: Record<string, EasingGraphStyle> = {
  Dot: "dot",
  Line: "line",
  Fill: "fill",
};

type ToggleButtonProps<T> = {
  value: boolean;
  setter: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactChildren | string;
};
const ToggleButton = ({
  children,
  value,
  setter,
}: ToggleButtonProps<unknown>) => (
  <button className={value ? "selected" : ""} onClick={() => setter(!value)}>
    {children}
  </button>
);

const isDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

function App() {
  const [f, setF] = useState<EasingFunction>(() => fs["cubic in out"]);
  const [style, setStyle] = useState<EasingGraphStyle>("line");
  const [clamp, setClamp] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [trails, setTrails] = useState(false);
  const [showExample, setShowExample] = useState(true);
  const [position, setPosition] = useState<ExamplePosition>("bottom");
  const [play, setPlay] = useState(0);

  const replay = () => setPlay((play + 1) % 2);
  const functionMap = Object.entries(fs);
  const styleMap = Object.entries(styles);

  return (
    <div className="App">
      <h1>Easing Graph Demo</h1>
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
          f={f}
          play={play}
          style={style}
          // steps={50}
          clamp={clamp}
          x={50}
          y={50}
          width={300}
          height={300}
          background={isDarkMode ? 0x333333 : showGrid ? 0xeeffff : 0xffffff}
          foreground={isDarkMode ? 0x00ffff : 0x0000ff}
          fillAlpha={0.5}
          markerColor={0xff00ff}
          markerSize={8}
          showExample={showExample}
          exampleColor={0xcc00ff}
          exampleSize={25}
          examplePosition={position}
          exampleTrail={trails}
          gridCount={showGrid ? 10 : 0}
          gridColor={isDarkMode ? 0x6600ff : 0x00ffff}
          gridSubdivisions={true}
        ></EasingGraph>
      </Stage>
      <div>
        <button onClick={replay}>Replay 🔄</button>
      </div>
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
        ))}
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
          </div>
        </div>

        <div>
          <h2>Other options</h2>
          <ToggleButton value={clamp} setter={setClamp}>
            Clamp Values
          </ToggleButton>
          <div>
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
                    position === "both"
                      ? "bottom"
                      : position === "bottom"
                      ? "right"
                      : position === "right"
                      ? "both"
                      : "bottom"
                  )
                }
              >
                {`Example Position (${position})`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
