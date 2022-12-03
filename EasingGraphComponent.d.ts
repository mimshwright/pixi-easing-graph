import EasingGraph, { EasingFunction, EasingGraphOptions } from "./EasingGraph";
export declare type EasingGraphProps = {
    f: EasingFunction;
    x?: number;
    y?: number;
    play?: number;
} & Partial<EasingGraphOptions>;
declare const _default: import("react").FC<{
    f: EasingFunction;
    x?: number | undefined;
    y?: number | undefined;
    play?: number | undefined;
} & Partial<EasingGraphOptions> & {
    ref?: import("react").Ref<EasingGraph> | undefined;
}>;
export default _default;
