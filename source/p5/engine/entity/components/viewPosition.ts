/*class*/
import { Component } from "./component";
import { Position } from "./position";

export class ViewPosition extends Component {
  private positionComponent: Position;

  constructor() {
    super();
    this.positionComponent = new Position();
  }

  get x(): number {
    return this.positionComponent.x - this.systems.camera.position.x;
  }

  get y(): number {
    return this.positionComponent.y - this.systems.camera.position.y;
  }

  get z(): number {
    return this.positionComponent.z - this.systems.camera.position.z;
  }
}
