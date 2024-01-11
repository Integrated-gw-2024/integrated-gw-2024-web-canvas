/*class*/
import p5 from "p5";

import { Entity } from "../entity";
import { SystemsRegistry } from "../../core/systemsRegistry";

export abstract class Component implements Disposable {
  private _p5: p5 | null;
  private _parentEntity: Entity | null;
  private _systems: SystemsRegistry | null;

  public readonly isUniqueComponent: boolean;

  constructor({ isUniqueComponent = true } = {}) {
    this._p5 = null;
    this._parentEntity = null;
    this._systems = null;

    this.isUniqueComponent = isUniqueComponent;
  }

  public setup(): void {}

  public update(): void {}

  public [Symbol.dispose](): void {}

  protected get p5(): p5 {
    if (this._p5 == null) throw new Error(`_p5 is null`);
    return this._p5;
  }

  protected get entity(): Entity {
    if (this._parentEntity == null) throw new Error(`_parentEntity is null`);
    return this._parentEntity;
  }

  protected get systems(): SystemsRegistry {
    if (this._systems == null) throw new Error(`_parentEntity is null`);
    return this._systems;
  }
}
