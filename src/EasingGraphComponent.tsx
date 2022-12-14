import { PixiComponent } from "@inlet/react-pixi";
import EasingGraph, {
  EasingFunction,
  EasingFunctionOptions,
  EasingGraphOptions,
} from "./EasingGraph";

export type EasingGraphProps = {
  f: EasingFunction | (EasingFunction | EasingFunctionOptions)[];
  x?: number;
  y?: number;
  play?: number;
} & Partial<EasingGraphOptions>;
export default PixiComponent<EasingGraphProps, EasingGraph>("EasingGraph", {
  create: ({ f, ...options }) => {
    return new EasingGraph(f, options);
  },
  didMount: (instance, _parent) => {
    // apply custom logic on mount
    instance.draw();
  },
  willUnmount: (instance, _parent) => {
    // clean up before removal
    instance.stop();
  },
  applyProps: (instance, oldProps, newProps) => {
    const {
      f: functionOld,
      play: playOld,
      x: xOld,
      y: yOld,
      ...optionsOld
    } = oldProps;
    const {
      f: funcitonNew,
      play: playNew,
      x: xNew,
      y: yNew,
      ...optionsNew
    } = newProps;

    if (playOld !== playNew) instance.play();

    const dirty =
      optionsOld !== optionsNew ||
      optionsOld.style !== optionsNew.style ||
      optionsOld.showExample !== optionsNew.showExample ||
      functionOld !== funcitonNew;

    instance.x = xNew ?? xOld ?? 0;
    instance.y = yNew ?? yOld ?? 0;
    instance.f = funcitonNew;
    instance.options = { ...instance.options, ...optionsNew };

    if (!dirty) return;
    instance.draw();
  },
  config: {
    // destroy instance on unmount?
    // default true
    destroy: true,

    /// destroy its children on unmount?
    // default true
    destroyChildren: true,
  },
});
