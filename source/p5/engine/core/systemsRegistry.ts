import p5 from "p5";

import { System } from "./systems/system";
import { CanvasManager } from "./systems/canvasManager";
import { Camera } from "./systems/camera";

export class SystemsRegistry {
  private readonly p5: p5;

  public readonly canvas: CanvasManager;
  public readonly camera: Camera;

  constructor(p5: p5) {
    this.p5 = p5;

    this.canvas = new CanvasManager();
    this.camera = new Camera();

    this.set(this.canvas);
    this.set(this.camera);
  }

  public set(system: System): void {
    system.setup(this.p5, this);
  }
}
