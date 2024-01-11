export class Calc {
  static map(value, srcA, srcB, dstA, dstB, clamp = true) {
    if (srcA === srcB) return dstA;
    if (clamp) {
      if (srcA < srcB) {
        if (value < srcA) value = srcA;
        else if (value > srcB) value = srcB;
      } else {
        if (value < srcB) value = srcB;
        else if (value > srcA) value = srcA;
      }
    }
    return ((value - srcA) * (dstB - dstA)) / (srcB - srcA) + dstA;
  }
}
