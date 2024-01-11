import { Component } from "../../engine/entity/components/component";
import { Position } from "../../engine/entity/components/position";
import { Rect } from "../../engine/entity/components/displayable/shapes/rect";

import { Color } from "../../engine/entity/components/displayable/displayable";

import { loadElement } from "../../../lib/elementLoader/loadElement";

export class TakeInHTMLElement extends Component {
  public readonly htmlElement: HTMLElement;
  public readonly rect: Rect;

  constructor(element: HTMLElement | string) {
    super();
    this.htmlElement = loadElement(element);

    this.rect = new Rect({
      width: this.htmlElement.offsetWidth,
      height: this.htmlElement.offsetHeight,
      fill: null,
      stroke: new Color(255, 0, 0, 255),
      strokeWeight: 4,
    });
  }

  public setup(): void {
    this.entity.addComponent(this.rect);

    this.systems.canvas.event.on(
      "resize",
      () => {
        this.sizeUpdate();
        this.positionUpdate();
      },
      this
    );

    this.sizeUpdate();
    this.positionUpdate();
  }

  public sizeUpdate(): void {
    this.rect.width = this.htmlElement.offsetWidth;
    this.rect.height = this.htmlElement.offsetHeight;
  }

  public positionUpdate(): void {
    const position = this.entity.getComponent(Position);

    const canvasClientRect = this.systems.canvas.canvasElement.getBoundingClientRect();
    const elementClientRect = this.htmlElement.getBoundingClientRect();

    position.x = window.scrollX + elementClientRect.x - canvasClientRect.x;
    position.y = window.scrollY + elementClientRect.y - canvasClientRect.y;
  }

  [Symbol.dispose](): void {
    super[Symbol.dispose]();
    this.systems.canvas.event.off("resize", this);
    this.entity.removeComponent(this.rect);
  }
}
