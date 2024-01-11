/* eslint-disable no-unused-vars */

export class EventListener {
  constructor();
  #addCallback(name: string, callback: () => void, scope: object, once: boolean);
  add<TA = undefined, TB = undefined, TC = undefined, TD = undefined, TE = undefined, TF = undefined>(
    name: string,
    callback?: (argA: TA, argB: TB, argC: TC, argD: TD, argE: TE, argF: TF) => void,
    scope?: object
  ): void;
  once<TA = undefined, TB = undefined, TC = undefined, TD = undefined, TE = undefined, TF = undefined>(
    name: string,
    callback?: (argA: TA, argB: TB, argC: TC, argD: TD, argE: TE, argF: TF) => void,
    scope?: object
  ): void;
  clear(): void;
  remove(name: string, scope: object): void;
  dispatch<TA = undefined, TB = undefined, TC = undefined, TD = undefined, TE = undefined, TF = undefined>(name: string, argA?: TA, argB?: TB, argC?: TC, argD?: TD, argE?: TE, argF?: TF): void;
  dispatchScope<TA = undefined, TB = undefined, TC = undefined, TD = undefined, TE = undefined, TF = undefined>(name: string, argA?: TA, argB?: TB, argC?: TC, argD?: TD, argE?: TE, argF?: TF): void;
  reverse(clamp?: boolean): void;
}
