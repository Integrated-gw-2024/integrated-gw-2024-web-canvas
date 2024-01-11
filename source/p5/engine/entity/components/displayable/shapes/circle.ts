/*class*/
import { Component } from "../../component";
import { ViewPosition } from "../../viewPosition";

/*interface*/
import { Displayable } from "../displayable";

/*type*/
import { ColorMode } from "../displayable";
import { ColorParameter } from "../displayable";
import { Color } from "../displayable";

export class Circle extends Component implements Displayable {
  /*displayable parameters*/
  public isDisplayable: boolean;
  public colorMode: "rgb" | "hsb";
  /**値を渡すときは必ずnewをする事。*/
  public fill: ColorParameter;
  /**値を渡すときは必ずnewをする事。*/
  public stroke: ColorParameter;
  public strokeWeight: number;

  /*circle parameters*/
  public diameter: number;

  constructor({
    diameter = 0,
    isDisplayable = true,
    colorMode = "rgb" as ColorMode,
    fill = new Color(255, 255, 255, 255) as ColorParameter,
    stroke = new Color(0, 0, 0, 255) as ColorParameter,
    strokeWeight = 2,
  } = {}) {
    super({ isUniqueComponent: false });

    this.diameter = diameter;

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

    this.p5.circle(position.x, position.y, this.diameter);
  }
}
