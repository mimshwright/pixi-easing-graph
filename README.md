# pixi-easing-graph

A utility component for viewing easing functions in [Pixi.js](https://github.com/pixijs/pixijs) and [react-pixi](https://github.com/inlet/react-pixi). The graph includes an animated example and can be highly-customized to fit your needs. Any function which takes a number between 0 and 1 and returns a number between 0 and 1 should work.

![easing-graph](https://user-images.githubusercontent.com/141928/205437278-2502105e-e92d-4eab-a110-613ac6a5ab9c.png)

## Usage

```js
import {EasingGraph} from "pixi-easing-graph";

const graph = new EasingGraph(func [, options]);
```

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
- `backgroundAlpha` - alpha for the background color - default `1.0`,
- `fillAlpha` - alpha for the foreground color in "fill" mode - default `0.5`,
- `gridCount` - How many lines in the grid on each axis. If 0, no grid is drawn - default `10`
- `gridSubdivisions` - when true, the middle and edges of the grid are emphasized - default `true`
- `gridColor` - Color of the grid - default `0xcccccc`
- `showMarker` - when true, the animation includes a marker dot that follows the graph - default `true`
- `markerColor` - color of the marker - default `0xff0000`
- `markerSize` - size of the marker - default `10`
- `markerTrail` - when true, the marker leave a trail of dots - default `false`
- `showMarker` - when true, the animation includes an example animation - default `false`
- `examplePosition` - position of the animated example: "bottom", "right" or "both - default `"bottom"`,
- `exampleColor` - color of the example animation - default `0x333333`
- `exampleSize` - size of the example - default `50`
- `exampleTrail` - when true, the examples leave a trail of dots - default `false`
- `duration` - Duration of the animation in milliseconds. - default is `2000`
- `autoPlay` - When true, the animation automatically plays any time `draw()` is called. - default `false`
- `loop` - When true, after you `play()` the animation will loop continuously until you call `stop()` - default `false`

### Animation

To play an animation of the easing function, use the `play()` method.

```js
import { EasingGraph } from "pixi-easing-graph";
const graph = new EasingGraph(quad);
stage.addChild(graph);
graph.play();
```

You can stop animations with `stop()`.

You can adjust the animations by using the `marker-` & `example-` properties in `options`. _More animation options coming soon._

## react-pixi

There is a [react-pixi](https://github.com/inlet/react-pixi) component included with the code.

```js
import { EasingGraphComponent as EasingGraph } from "pixi-easing-graph";
```

All the options can be passed to this component as props as well as `f`, `x`, `y`.

As a hack, to trigger the animation, you can also set the `play` property to a different value to trigger the animation.

```js
<button onClick={()=> setPlay(play === 0 ? 1 : 0)}>
```

## Development

### Scripts

- `dev` : start a server to see the demo
- `lint` : lint the code. You can also do `fix` to auto-fix.
- `test` : test with jest. Also `test:coverage` and `test:watch`
- `build` : bundle the code
- `commit` & `release` : see below
- `deploy`: Build the demo code and publish to gh-pages

### Commits & Releases

Code is automatically linted before being committed. I recommend installing the plugins for eslint and prettier in your code editor. You can attempt to fix linting issues with `yarn fix`.

When ready to commit, please commit using `yarn commit` to use commitizen for standard format commits.

When ready to release use `yarn release` with the `-r patch|minor|major` flag (default without the flag is `patch`).

You'll then need to publish your changes separately.

You can deploy an updated demo to github pages using `yarn deploy`
