# pixi-easing-graph

A utility component for viewing easing functions in Pixi.js

## Usage

`new EasingGraph(func [, options]);`

`func` must be an easing function in the format `(x:number) => number` where the range of numbers expected for both input and output are between `0.0` and `1.0`

`options` is an object with the following properties and default values:

- `width` - width of the graph - default `250`
- `height` - height of the graph - default `250`
- `style` - graph style: "dot", "line", or "fill" - default `"dot"`,
- `clamp` - if true, clamps values between the range of 0 and 1 - default `false`
- `steps` - number of steps of the function to draw. If the value is NaN, this will equal `width` - default `NaN`
- `dotSize` - size of dots when style is "dot" (also used for trails) - default `2`
- `background` - background color - default `0xffffff`
- `foreground` - foreground (graph) color - default `0x000000`
- `fillAlpha` - alpha for the foreground color in "fill" mode - default `0`5,
- `showMarker` - when true, the animation includes a marker dot that follows the graph - default `true`
- `markerColor` - color of the marker - default `0xff0000`
- `markerSize` - size of the marker - default `10`
- `examplePosition` - position of the animated example: "bottom", "right" or "both - default `"bottom"`,
- `exampleColor` - color of the example animation - default `0x333333`
- `exampleSize` - size of the example - default `50`
- `exampleTrail` - when true, the examples leave a trail of dots - default `false`
- `gridCount` - How many lines in the grid on each axis. If 0, no grid is drawn - default `10`
- `gridColor` - Color of the grid - default `0xcccccc`
- `gridSubdivisions` - when true, the middle and edges of the grid are emphasized - default `true`

### Animation

To play an animation of the easing function, use the `play()` method.

```javascript
const graph = new EasingGraph(quad);
stage.addChild(graph);
graph.play();
```

You can stop animations with `stop()`.

You can adjust the animations by using the `marker-` & `example-` properties in `options`. _More animation options coming soon._

## react-pixi

There is a [react-pixi](https://github.com/inlet/react-pixi) component included with the code.

`import EasingGraph from "pixi-easing-graph/react-pixi"`

All the options can be passed to this component as props as well as `f`, `x`, `y`.

As a hack, to trigger the animation, you can also set the `play` property to a different value to trigger the animation.

`<button onClick={()=> setPlay(play === 0 ? 1 : 0)}>`
