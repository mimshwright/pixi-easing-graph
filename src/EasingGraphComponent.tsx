import { PixiComponent } from "@inlet/react-pixi";
import EasingGraph, { EasingGraphProps } from "./EasingGraph";

export default PixiComponent<EasingGraphProps, EasingGraph>("EasingGraph", {
  create: ({ f, ...options }) => {
    return new EasingGraph(f, options);
  },
  didMount: (instance, parent) => {
    // apply custom logic on mount
    instance.draw();
  },
  willUnmount: (instance, parent) => {
    // clean up before removal
  },
  applyProps: (instance, oldProps, newProps) => {
    const { f: functionOld, x: xOld, y: yOld, ...optionsOld } = oldProps;
    const { f: funcitonNew, x: xNew, y: yNew, ...optionsNew } = newProps;

    const dirty =
      optionsOld !== optionsNew ||
      optionsOld.style !== optionsNew.style ||
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
