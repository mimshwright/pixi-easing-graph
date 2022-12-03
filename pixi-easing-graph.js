var L = Object.defineProperty;
var M = (s, o, i) => o in s ? L(s, o, { enumerable: !0, configurable: !0, writable: !0, value: i }) : s[o] = i;
var h = (s, o, i) => (M(s, typeof o != "symbol" ? o + "" : o, i), i);
import { PixiComponent as $ } from "@inlet/react-pixi";
import { Ticker as A, Sprite as _, Graphics as z } from "pixi.js";
function a(s) {
  return s != null && typeof s == "object" && s["@@functional/placeholder"] === !0;
}
function w(s) {
  return function o(i) {
    return arguments.length === 0 || a(i) ? o : s.apply(this, arguments);
  };
}
function u(s) {
  return function o(i, r) {
    switch (arguments.length) {
      case 0:
        return o;
      case 1:
        return a(i) ? o : w(function(e) {
          return s(i, e);
        });
      default:
        return a(i) && a(r) ? o : a(i) ? w(function(e) {
          return s(e, r);
        }) : a(r) ? w(function(e) {
          return s(i, e);
        }) : s(i, r);
    }
  };
}
function D(s) {
  return function o(i, r, e) {
    switch (arguments.length) {
      case 0:
        return o;
      case 1:
        return a(i) ? o : u(function(t, n) {
          return s(i, t, n);
        });
      case 2:
        return a(i) && a(r) ? o : a(i) ? u(function(t, n) {
          return s(t, r, n);
        }) : a(r) ? u(function(t, n) {
          return s(i, t, n);
        }) : w(function(t) {
          return s(i, r, t);
        });
      default:
        return a(i) && a(r) && a(e) ? o : a(i) && a(r) ? u(function(t, n) {
          return s(t, n, e);
        }) : a(i) && a(e) ? u(function(t, n) {
          return s(t, r, n);
        }) : a(r) && a(e) ? u(function(t, n) {
          return s(i, t, n);
        }) : a(i) ? w(function(t) {
          return s(t, r, e);
        }) : a(r) ? w(function(t) {
          return s(i, t, e);
        }) : a(e) ? w(function(t) {
          return s(i, r, t);
        }) : s(i, r, e);
    }
  };
}
var R = /* @__PURE__ */ u(function(o, i) {
  return o.apply(this, i);
});
const b = R;
var j = /* @__PURE__ */ D(function(o, i, r) {
  if (o > i)
    throw new Error("min must not be greater than max in clamp(min, max, value)");
  return r < o ? o : r > i ? i : r;
});
const U = j;
function q(s) {
  return s;
}
var B = /* @__PURE__ */ w(q);
const X = B;
var H = /* @__PURE__ */ u(function(o, i) {
  var r = Number(i), e = 0, t;
  if (r < 0 || isNaN(r))
    throw new RangeError("n must be a non-negative number");
  for (t = new Array(r); e < r; )
    t[e] = o(e), e += 1;
  return t;
});
const Y = H;
var I = /* @__PURE__ */ u(function(o, i) {
  for (var r = [], e = 0, t = Math.min(o.length, i.length); e < t; )
    r[e] = [o[e], i[e]], e += 1;
  return r;
});
const J = I, F = A.shared, E = {
  width: 250,
  height: 250,
  style: "dot",
  clamp: !1,
  steps: NaN,
  dotSize: 2,
  background: 16777215,
  foreground: 0,
  fillAlpha: 0.5,
  showMarker: !0,
  markerColor: 16711680,
  markerSize: 10,
  markerTrail: !1,
  showExample: !1,
  exampleColor: 3355443,
  exampleSize: 50,
  examplePosition: "bottom",
  exampleTrail: !1,
  gridCount: 10,
  gridColor: 13421772,
  gridSubdivisions: !0,
  duration: 2e3,
  autoPlay: !1,
  loop: !1
}, O = U(0, 1);
class G extends _ {
  constructor(i, r = {}) {
    super();
    h(this, "f");
    h(this, "graphics");
    h(this, "trail");
    h(this, "options");
    h(this, "isPlaying", !1);
    h(this, "marker");
    h(this, "exampleX");
    h(this, "exampleY");
    h(this, "t", 0);
    this.f = i, this.options = { ...E, ...r }, this.graphics = new z(), this.addChild(this.graphics), this.trail = new z(), this.addChild(this.trail);
    const { markerSize: e, markerColor: t, exampleColor: n, exampleSize: l } = this.options;
    this.marker = new P(t, e), this.marker.visible = !1, this.addChild(this.marker), this.exampleX = new P(n, l), this.exampleX.visible = !1, this.exampleX.x = 0, this.exampleX.y = this.options.height + l * 1.5, this.addChild(this.exampleX), this.exampleY = new P(n, l), this.exampleY.visible = !1, this.exampleY.x = this.options.width + l * 1.5, this.exampleY.y = this.options.height, this.addChild(this.exampleY);
  }
  play() {
    this.stop();
    const { showMarker: i, showExample: r, examplePosition: e } = this.options;
    i && (this.marker.visible = !0), r && (this.exampleY.visible = this.exampleX.visible = !0), e === "bottom" && (this.exampleY.visible = !1), e === "right" && (this.exampleX.visible = !1), this.trail.clear(), this.t = 0, this.isPlaying = !0, F.add(this.animationStep, this);
  }
  stop() {
    F.remove(this.animationStep, this), this.isPlaying = !1;
  }
  animationStep() {
    this.t += F.deltaMS;
    const { t: i, options: r, exampleX: e, exampleY: t, marker: n, f: l, trail: p } = this, {
      clamp: c,
      width: m,
      height: d,
      exampleTrail: f,
      markerTrail: y,
      dotSize: g,
      foreground: x,
      duration: S,
      loop: T
    } = r, N = c ? O : X, v = i / S, k = N(l(v));
    n.x = v * m, n.y = d - k * d, e.visible && (e.x = k * m), t.visible && (t.y = n.y);
    const C = p;
    C.beginFill(x), f && (e.visible && C.drawCircle(e.x, e.y, g), t.visible && C.drawCircle(t.x, t.y, g)), y && n.visible && C.drawCircle(n.x, n.y, g), C.endFill(), i > S && (this.stop(), T && this.play());
  }
  draw() {
    const i = this.graphics, {
      width: r,
      height: e,
      style: t,
      background: n,
      steps: l,
      gridCount: p,
      clamp: c,
      autoPlay: m
    } = this.options, d = isNaN(l) ? r : l, f = c ? O : X, y = Y((v) => v / (d - 1), d), g = y.map(this.f).map(f), x = J(y, g), S = ([v, k]) => [
      v * r,
      e - k * e
    ], T = x.map(S);
    i.clear(), i.beginFill(n), i.drawRect(0, 0, r, e), i.endFill(), p > 0 && this.drawGrid(), {
      line: this.drawLines,
      fill: this.drawFill,
      dot: this.drawDots
    }[t].call(this, T), m && this.play();
  }
  drawDots(i) {
    const { foreground: r, dotSize: e } = this.options, t = this.graphics, n = (l, p) => t.drawCircle(l, p, e);
    t.beginFill(r), i.map(b(n)), t.endFill();
  }
  drawLines(i) {
    const { foreground: r, height: e } = this.options, t = this.graphics, n = b(t.lineTo.bind(t));
    t.moveTo(0, e), t.lineStyle(1, r), i.map(n), t.lineStyle();
  }
  drawFill(i) {
    const { foreground: r, fillAlpha: e, width: t, height: n } = this.options, l = this.graphics, p = b(l.lineTo.bind(l));
    l.moveTo(0, n), l.beginFill(r, e), i.map(p), l.lineTo(t, 0), l.lineTo(t, n), l.lineTo(0, n), l.endFill(), l.closePath();
  }
  drawGrid() {
    const i = this.graphics, { width: r, height: e, gridCount: t, gridColor: n, gridSubdivisions: l } = this.options;
    i.lineStyle(1, n), Y((c) => {
      i.lineStyle(1, n), (l && c === 0 || c === t || c === t / 2 && t % 2 === 0) && (i.lineStyle(2, n), i.lineStyle(2, n)), i.moveTo(0, c / t * e), i.lineTo(r, c / t * e), i.closePath(), i.moveTo(c / t * r, 0), i.lineTo(c / t * r, e), i.closePath();
    }, t + 1), i.lineStyle();
  }
}
h(G, "defaultOptions", E);
class P extends _ {
  constructor(i, r, e) {
    super(e);
    h(this, "color");
    h(this, "size");
    h(this, "graphics");
    this.color = i, this.size = r, this.graphics = new z(), this.addChild(this.graphics), this.anchor.set(0.5), this.draw();
  }
  draw() {
    const { graphics: i, color: r, size: e } = this;
    i.clear(), i.beginFill(r), i.drawCircle(0, 0, e), i.endFill();
  }
}
const W = $("EasingGraph", {
  create: ({
    f: s,
    ...o
  }) => new G(s, o),
  didMount: (s, o) => {
    s.draw();
  },
  willUnmount: (s, o) => {
  },
  applyProps: (s, o, i) => {
    var g, x;
    const {
      f: r,
      play: e,
      x: t,
      y: n,
      ...l
    } = o, {
      f: p,
      play: c,
      x: m,
      y: d,
      ...f
    } = i;
    e !== c && s.play();
    const y = l !== f || l.style !== f.style || l.showExample !== f.showExample || r !== p;
    s.x = (g = m != null ? m : t) != null ? g : 0, s.y = (x = d != null ? d : n) != null ? x : 0, s.f = p, s.options = {
      ...s.options,
      ...f
    }, y && s.draw();
  },
  config: {
    destroy: !0,
    destroyChildren: !0
  }
});
export {
  G as EasingGraph,
  W as EasingGraphComponent
};
