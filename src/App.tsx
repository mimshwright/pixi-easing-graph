import { Stage } from "@inlet/react-pixi";
import EasingGraph from "./EasingGraphComponent";
import { EasingFunction, EasingGraphStyle } from "./EasingGraph";
import "./App.css";
import { useState } from "react";

const poly = (exp: number) => (x: number) => x ** exp;
const scale =
  (s: number) =>
  (f: EasingFunction): EasingFunction =>
  (x) =>
    f(x * s);
const K = (k: number) => (_: number) => k;
const I = (x: number) => x;
const thresh = (threshold: number) => (x: number) => x < threshold ? 0 : 1;
const reflectY = (f: EasingFunction) => (x: number) => 1 - f(x);
const reflectX = (f: EasingFunction) => (x: number) => f(1 - x);
const split =
  (a: EasingFunction, b: EasingFunction): EasingFunction =>
  (x) =>
    x < 0.5 ? a(x) : b(x);
const splitN =
  (fs: EasingFunction[]): EasingFunction =>
  (x) =>
    fs[Math.max(0, Math.floor(x * fs.length))](x);
const mirror = (f: EasingFunction): EasingFunction =>
  split(scale(2)(f), reflectX(scale(2)(f)));
const sine = (freq: number) => (x: number) =>
  Math.sin(x * freq * Math.PI * 2) / 2 + 0.5;
const cosine = (freq: number) => (x: number) => sine(freq)(x + 0.25 / freq);

const fs = {
  linear: I,
  "linear-2x": scale(2)(I),
  "linear-0.5x": scale(0.5)(I),
  quad: poly(2),
  cubic: poly(3),
  quart: poly(4),
  quint: poly(5),
  "cubic-reflectY": reflectY(poly(3)),
  "cubic-reflectX": reflectX(poly(3)),
  sine: sine(2),
  cosine: cosine(2),
  rand: (x: number) => Math.random(),
  const: K(0.5),
  thresh: thresh(0.5),
  splitLinearQuad: split(I, poly(2)),
  splitMulti: splitN([I, K(0.25), I, K(0.75)]),
  mirror: mirror(I),
};
const styles: Record<string, EasingGraphStyle> = {
  Dot: "dot",
  Line: "line",
  Fill: "fill",
};

function App() {
  const [f, setF] = useState<EasingFunction>(() => fs.quad);
  const [style, setStyle] = useState<EasingGraphStyle>("dot");
  const [play, setPlay] = useState(0);

  const replay = () => setPlay((play + 1) % 2);
  const functionMap = Object.entries(fs);
  const styleMap = Object.entries(styles);

  return (
    <div className="App">
      <h1>Easing Graph Demo</h1>
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
      <div>
        <button style={{ fontSize: 30, padding: 20 }} onClick={replay}>
          🔄
        </button>
      </div>
      <Stage
        width={800}
        height={450}
        options={{ resolution: 2, backgroundColor: 0xcccccc }}
      >
        <EasingGraph
          f={f}
          play={play}
          style={style}
          steps={50}
          x={275}
          y={100}
          width={250}
          height={250}
          background={0xeeffff}
          foreground={0x0000ff}
          markerColor={0xff00ff}
          markerSize={8}
          exampleColor={0xffffff}
          exampleSize={25}
          // examplePosition={"both"}
          // exampleTrail={true}
          gridCount={10}
          gridColor={0x00ffff}
          gridSubdivisions={true}
        />
      </Stage>
    </div>
  );
}

export default App;
