import { Easing } from "../util/easing";
import { Calc } from "../util/calc";

export class FrameTween {
  constructor(froms, tos, frames, easing = Easing.linear) {
    if (froms.length !== tos.length) {
      throw new Error("引数fromsと引数tosの要素数は同じにしてください");
    }

    if (typeof froms == "number") {
      this.froms = [froms];
      this.tos = [tos];
    } else {
      this.froms = froms;
      this.tos = tos;
    }
    this.frames = frames;
    this.frame = 0;
    this.easing = easing;
  }

  getValue() {
    return Calc.map(this.easing(this.frame / (this.frames - 1)), 0, 1, this.froms[0], this.tos[0]);
  }

  getValues() {
    const result = new Array(this.froms.length);
    for (let i = 0; i < this.froms.length; i++) {
      result[i] = Calc.map(
        this.easing(this.frame / (this.frames - 1)),
        0,
        1,
        this.froms[i],
        this.tos[i]
      );
    }

    return result;
  }

  update() {
    if (this.frame < this.frames) {
      this.frame++;
    }
  }
}
