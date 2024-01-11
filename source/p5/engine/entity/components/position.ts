/*class*/
import { Component } from "./component";
import { ViewPosition } from "./viewPosition";

export class Position extends Component {
  public x: number;
  public y: number;
  public z: number;

  constructor({ x = 0, y = 0, z = 0 } = {}) {
    super();

    this.x = x;
    this.y = y;
    this.z = z;
  }

  public setup(): void {
    const viewPosition = this.entity.getComponent(ViewPosition);
    const source = { positionComponent: this };
    Object.assign(viewPosition, source);
  }

  [Symbol.dispose](): void {
    const viewPosition = this.entity.getComponent(ViewPosition);
    const source = { positionComponent: new Position() };
    Object.assign(viewPosition, source);
  }
}
