export type ColorMode = "rgb" | "hsb";
export type ColorParameter = Color | null;

export class Color {
  v1: number;
  v2: number;
  v3: number;
  a: number;
  pika: string;

  constructor(v1 = 0, v2 = 0, v3 = 0, a = 1) {
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
    this.a = a;
    this.pika = "pika-";
  }
}

export interface Displayable {
  isDisplayable: boolean;
  colorMode: ColorMode;
  fill: ColorParameter;
  stroke: ColorParameter;
  strokeWeight: number;
  display(): void;
}
