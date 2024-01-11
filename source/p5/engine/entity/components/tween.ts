import * as TweenAnime from "../../../../lib/tweenAnime/tweenAnime";
import { Component } from "./component";

export type TweenParameter = {
  from: number;
  to: number;
  easing: TweenAnime.Easing;
};

export class Tween extends Component {
  private tweenData: Map<object, Map<string, TweenAnime.Tween>>;

  constructor() {
    super();
    this.tweenData = new Map();
  }

  createTween<T extends object>(
    component: T,
    propertyName: { [K in keyof T]: T[K] extends number ? K : never }[keyof T],
    from: number,
    to: number,
    easing: TweenAnime.Easing = TweenAnime.Easing.linear
  ): void {
    if (!this.tweenData.has(component)) {
      this.tweenData.set(component, new Map());
    }

    this.tweenData.get(component)!.set(propertyName as string, new TweenAnime.Tween(from, to, easing));
  }

  /**0 ~ 1の値を入力 */
  setProgress<T extends object>(
    progressRate: number,
    component?: T,
    propertyName?: { [K in keyof T]: T[K] extends number ? K : never }[keyof T]
  ): void {
    if (component == undefined) {
      this.tweenData.forEach((properties, component) => {
        properties.forEach((tween, propertyName) => {
          Reflect.set(component, propertyName, tween.getValue(progressRate));
        });
      });

      return;
    }

    const properties = this.tweenData.get(component);
    if (properties == null) {
      throw new Error(`'${component.constructor.name}' component has not been register `);
    }

    if (propertyName == undefined) {
      properties.forEach((tween, propertyName) => {
        Reflect.set(component, propertyName, tween.getValue(progressRate));
      });

      return;
    }

    const tween = properties.get(propertyName as string);
    if (tween == null) {
      throw new Error(`'${propertyName as string}' property has not been register `);
    }

    Reflect.set(component, propertyName, tween.getValue(progressRate));
  }
}