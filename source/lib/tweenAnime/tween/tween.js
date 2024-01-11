import { Easing } from "../util/easing";
import { Calc } from "../util/calc";

export class Tween {
  constructor(froms, tos, easing = Easing.linear) {
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
    this.easing = easing;
  }

  getValue(progressRate) {
    return Calc.map(this.easing(progressRate), 0, 1, this.froms[0], this.tos[0]);
  }

  getIndexValue(index, progressRate) {
    return Calc.map(this.easing(progressRate), 0, 1, this.froms[index], this.tos[index]);
  }

  getValues(progressRate) {
    const result = new Array(this.froms.length);
    for (let i = 0; i < this.froms.length; i++) {
      result[i] = Calc.map(
        this.easing(this.easing(progressRate)),
        0,
        1,
        this.froms[i],
        this.tos[i]
      );
    }

    return result;
  }
}
