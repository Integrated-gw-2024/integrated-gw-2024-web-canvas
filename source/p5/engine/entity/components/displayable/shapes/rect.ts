/*class*/
import { Component } from "../../component";
import { ViewPosition } from "../../viewPosition";

/*interface*/
import { Displayable } from "../displayable";

/*type*/
import { ColorMode } from "../displayable";
import { ColorParameter } from "../displayable";

export class Rect extends Component implements Displayable {
  /*displayable parameters*/
  public isDisplayable: boolean;
  public colorMode: "rgb" | "hsb";
  public fill: ColorParameter;
  public stroke: ColorParameter;
  public strokeWeight: number;

  /*rect parameters*/
  public width: number;
  public height: number;

  constructor({
    width = 100,
    height = 100,
    isDisplayable = true,
    colorMode = "rgb" as ColorMode,
    fill = { v1: 255, v2: 255, v3: 255, a: 255 } as ColorParameter,
    stroke = { v1: 0, v2: 0, v3: 0, a: 255 } as ColorParameter,
    strokeWeight = 2,
  } = {}) {
    super({ isUniqueComponent: false });

    this.width = width;
    this.height = height;

    this.isDisplayable = isDisplayable;
    this.colorMode = colorMode;
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWeight = strokeWeight;
  }

  public update(): void {
    this.display();
  }

  display(): void {
    if (this.isDisplayable == false) return;

    const position = this.entity.getComponent(ViewPosition);

    this.p5.colorMode(this.colorMode);
    if (this.fill == null) {
      this.p5.noFill();
    } else {
      this.p5.fill(this.fill.v1, this.fill.v2, this.fill.v3, this.fill.a);
    }
    if (this.stroke == null) {
      this.p5.noStroke();
    } else {
      this.p5.stroke(this.stroke.v1, this.stroke.v2, this.stroke.v3, this.stroke.a);
    }
    this.p5.strokeWeight(this.strokeWeight);

    this.p5.rect(position.x, position.y, this.width, this.height);
  }
}
