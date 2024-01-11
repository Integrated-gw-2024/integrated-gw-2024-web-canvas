/* class */
import p5 from "p5";
import { Entity } from "../entity/entity";
import { SystemsRegistry } from "./systemsRegistry";

/* interface */

export class World implements Disposable {
  private readonly p5: p5;
  private readonly entities: Map<Entity, Entity>;
  public readonly systems: SystemsRegistry;

  constructor(p5: p5) {
    this.p5 = p5;

    this.systems = new SystemsRegistry(p5);
    this.entities = new Map();
  }

  public addEntity(entity: Entity): void {
    entity.setup(this.p5, this.systems);

    this.entities.set(entity, entity);
  }

  public removeEntity(entity: Entity): void {
    if (!this.entities.has(entity)) {
      throw new Error(`'${entity.constructor.name}' entity has not been added.`);
    }

    entity[Symbol.dispose]();
    this.entities.delete(entity);
  }

  public getEntities(): Entity[] {
    return Array.from(this.entities.values());
  }

  [Symbol.dispose](): void {
    this.entities.forEach((entity) => {
      entity[Symbol.dispose]();
    });
    this.entities.clear();
  }

  public update(): void {
    this.entities.forEach((entity) => {
      entity.update();
    });
  }
}
