import p5 from "p5";
import { SystemsRegistry } from "../systemsRegistry";

export abstract class System {
  private _p5: p5 | null;
  private _systems: SystemsRegistry | null;

  constructor() {
    this._p5 = null;
    this._systems = null;
  }

  public setup(p5: p5, systems: SystemsRegistry): void {
    this._p5 = p5;
    this._systems = systems;
  }

  public update(): void {}

  protected get p5(): p5 {
    if (this._p5 == null) throw new Error(`_p5 is '${this._systems}'`);
    return this._p5;
  }

  protected get systems(): SystemsRegistry {
    if (this._systems == null) throw new Error(`_systems is '${this._systems}'`);
    return this._systems;
  }
}
