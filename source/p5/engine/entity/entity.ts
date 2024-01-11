/* class */
import p5 from "p5";
import { SystemsRegistry } from "../core/systemsRegistry";
import { Component } from "./components/component";
import { ViewPosition } from "./components/viewPosition";

export class Entity implements Disposable {
  private p5: p5 | null;
  private systems: SystemsRegistry | null;
  private componentTypes: Map<string, Map<Component, Component>>;

  constructor() {
    this.p5 = null;
    this.systems = null;
    this.componentTypes = new Map();

    this.addComponent(new ViewPosition());
  }

  setup(p5: p5, systems: SystemsRegistry): void {
    this.p5 = p5;
    this.systems = systems;

    const source = {
      _p5: p5,
      _parentEntity: this,
      _systems: systems,
    };

    this.componentTypes.forEach((components) => {
      components.forEach((component) => {
        Object.assign(component, source);
        component.setup();
      });
    });
  }

  update(): void {
    this.componentTypes.forEach((components) => {
      components.forEach((component) => {
        component.update();
      });
    });
  }

  addComponent(component: Component): void {
    if (!this.componentTypes.has(component.constructor.name)) {
      this.componentTypes.set(component.constructor.name, new Map<Component, Component>());
    }

    if (this.componentTypes.get(component.constructor.name)!.has(component)) {
      throw new Error(`'${component.constructor.name}' is already contained in this entity.`);
    }

    if (this.hasComponent(component.constructor.prototype.constructor) && component.isUniqueComponent) {
      throw new Error(
        `'${component.constructor.name}' is already contained in this entity type.\n` +
          `  Reason: '${component.constructor.name}' is UniqueComponent`
      );
    }

    if (this.p5 != null && this.systems != null) {
      const source = {
        _p5: this.p5,
        _parentEntity: this,
        _systems: this.systems,
      };

      Object.assign(component, source);
    }

    this.componentTypes.get(component.constructor.name)!.set(component, component);
  }

  removeComponent(component: Component): void {
    const components = this.componentTypes.get(component.constructor.name);

    if (components == undefined) {
      throw new Error(`'${component.constructor.name}' component has not been added.`);
    }

    if (!components.has(component)) {
      throw new Error(`${component}' has not been added.`);
    }

    component[Symbol.dispose]();
    components.delete(component);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasComponent<T extends Component>(componentType: new (...arg: any) => T): boolean {
    const result = this.componentTypes.get(componentType.name);
    if (result == undefined) {
      return false;
    }

    if (Array.from(result.values())[0] == undefined) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getComponents<T extends Component>(componentType: new (...arg: any) => T): InstanceType<new () => T>[] {
    if (!this.hasComponent(componentType)) {
      throw new Error(`'${componentType.name}' component has not been added `);
    }

    return Array.from(this.componentTypes.get(componentType.name)!.values()) as InstanceType<new () => T>[];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getComponent<T extends Component>(componentType: new (...arg: any) => T): InstanceType<new () => T> {
    return this.getComponents(componentType)[0];
  }

  [Symbol.dispose](): void {
    this.componentTypes.forEach((components) => {
      components.forEach((component) => {
        component[Symbol.dispose]();
      });
    });
    this.componentTypes.clear();
  }
}

/*
export class Entity {
  dispose(): void {
    if (this.systems == null)
      throw new Error(`Unable to dispose '${this}' from World.\n` + `Reason: Scope '${this}' is not added to world.`);

    this.systems.entitiesManager.event.fireScope("remove", { uuid: this.uuid }, this);
  }
  dispose<T extends typeof Component>(componentType: T): void {
    this.components.delete(componentType.name);
  }
}
*/
