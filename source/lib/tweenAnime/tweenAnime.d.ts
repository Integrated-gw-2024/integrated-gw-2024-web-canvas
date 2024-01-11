/* eslint-disable no-unused-vars */

export class Timer {
  constructor(timer_length: number, continue_time?: number);
  start(): void;
  stop(): void;
  reset(): void;
  reverse(clamp?: boolean): void;
  setTimerLength(Timer_length: number): void;
  setElapsedTime(Continue_time: number): void;
  getRunning(): boolean;
  getReverse(): boolean;
  getCompleat(): boolean;
  getTimerLength(): number;
  getElapsedTime(clamp?: boolean): number;
  getProgress(clamp?: boolean): number;
}

export class Calc {
  static map(
    value: number,
    srcA: number,
    srcB: number,
    dstA: number,
    dstB: number,
    clamp?: boolean
  ): number;
}

type EasingFunction = (t: number) => number;
export class Easing {
  static linear(t: number): number;
        static easeInQuad(t: number): number;
        static easeOutQuad(t: number): number;
        static easeInOutQuad(t: number): number;
        static easeInCubic(t: number): number;
        static easeOutCubic(t: number): number;
        static easeInOutCubic(t: number): number;
        static easeInQuart(t: number): number;
        static easeOutQuart(t: number): number;
        static easeInOutQuart(t: number): number;
        static easeInQuint(t: number): number;
        static easeOutQuint(t: number): number;
        static easeInOutQuint(t: number): number;
        static easeInSine(t: number): number;
        static easeOutSine(t: number): number;
        static easeInOutSine(t: number): number;
        static easeInExpo(t: number): number;
        static easeOutExpo(t: number): number;
        static easeInOutExpo(t: number): number;
        static easeInCirc(t: number): number;
        static easeOutCirc(t: number): number;
        static easeInOutCirc(t: number): number;
        static createEaseInElastic(s?: number): EasingFunction;
        static createEaseOutElastic(s?: number): EasingFunction;
        static createEaseInOutElastic(s?: number): EasingFunction;
        static easeInElastic(t: number): number;
        static easeOutElastic(t: number): number;
        static easeInOutElastic(t: number): number;
        private static defaultEaseInElastic;
        private static defaultEaseOutElastic;
        private static defaultEaseInOutElastic;
        static createEaseInBack(s?: number): EasingFunction;
        static createEaseOutBack(s?: number): EasingFunction;
        static createEaseInOutBack(s?: number): EasingFunction;
        static easeInBack(t: number): number;
        static easeOutBack(t: number): number;
        static easeInOutBack(t: number): number;
        private static defaultEaseInBack;
        private static defaultEaseOutBack;
        private static defaultEaseInOutBack;
        static easeInBounce(t: number): number;
        static easeOutBounce(t: number): number;
        static easeInOutBounce(t: number): number;
}

export class Tween {
  constructor(froms: number[] | number, tos: number[] | number, easing?: Easing);
  getValue(progressRate: number): number;
  getIndexValue(index: number, progressRate: number): number;
  getValues(progressRate: number): number[];
}

export class FrameTween {
  frames: number;
  frame: number;
  constructor(froms: number[] | number, tos: number[] | number, frames: number, easing: Easing);
  getValue(): number;
  getValues(): number[];
  update(): void;
}
