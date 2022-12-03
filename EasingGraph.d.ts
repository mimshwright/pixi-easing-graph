import { Sprite, Graphics, Texture } from "pixi.js";
declare type Point = [number, number];
export declare type EasingFunction = (x: number) => number;
export declare type EasingGraphStyle = "dot" | "line" | "fill";
export declare type ExamplePosition = "bottom" | "right" | "both";
export interface EasingGraphOptions {
    width: number;
    height: number;
    steps: number;
    style: EasingGraphStyle;
    clamp: boolean;
    background: number;
    foreground: number;
    fillAlpha: number;
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
    gridColor: number;
    gridCount: number;
    gridSubdivisions: boolean;
    duration: number;
    autoPlay: boolean;
    loop: boolean;
}
declare class EasingGraph extends Sprite {
    f: EasingFunction;
    graphics: Graphics;
    trail: Graphics;
    options: EasingGraphOptions;
    isPlaying: boolean;
    marker: Marker;
    exampleX: Marker;
    exampleY: Marker;
    t: number;
    static defaultOptions: EasingGraphOptions;
    constructor(f: EasingFunction, options?: Partial<EasingGraphOptions>);
    play(): void;
    stop(): void;
    private animationStep;
    draw(): void;
    drawDots(coords: Point[]): void;
    drawLines(coords: Point[]): void;
    drawFill(coords: Point[]): void;
    drawGrid(): void;
}
export default EasingGraph;
declare class Marker extends Sprite {
    color: number;
    size: number;
    graphics: Graphics;
    constructor(color: number, size: number, texture?: Texture);
    draw(): void;
}
