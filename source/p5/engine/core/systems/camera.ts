/*class*/
import { System } from "./system";
import { Emitter } from "../../../../lib/emitter/emitter";

/*interface*/
import { HasEvent } from './../../interface/hasEvent';
import { HasPosition } from "../../interface/hasPosition";

type CameraEvent = {
  positionUpdate: {
    x: number;
    y: number;
    z: number;
  };
};

export class Camera extends System implements HasEvent<CameraEvent>, HasPosition {
  public readonly event: Emitter<CameraEvent>;

  public readonly position: CameraPosition;

  constructor() {
    super();
    this.event = new Emitter<CameraEvent>();
    this.event.on("positionUpdate");

    this.position = new CameraPosition(this.event);
  }
}

class CameraPosition {
  private readonly event: Emitter<CameraEvent>;

  private _x: number;
  private _y: number;
  private _z: number;

  constructor(event: Emitter<CameraEvent>) {
    this.event = event;

    this._x = 0;
    this._y = 0;
    this._z = 0;
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
    this.event.fire("positionUpdate", { x: this._x, y: this._y, z: this.z });
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
    this.event.fire("positionUpdate", { x: this._x, y: this._y, z: this.z });
  }

  get z(): number {
    return this._z;
  }

  set z(value: number) {
    this._z = value;
    this.event.fire("positionUpdate", { x: this._x, y: this._y, z: this.z });
  }
}
