type Callback<Values> = (values: Values) => void;
type Observers<T extends object> = { [K in keyof T]?: Map<object, Observer<T[K]>> };

class Observer<Values> {
  public readonly callback: Callback<Values>;
  public readonly once: boolean;

  constructor(callback: Callback<Values>, once: boolean) {
    this.callback = callback;
    this.once = once;
  }
}

export class Emitter<T extends object> {
  private readonly observers: Observers<T>;

  constructor() {
    this.observers = {};
  }

  private addObserver<EventName extends keyof T>(
    eventName: EventName,
    callback: Callback<T[EventName]> | undefined,
    scope: object | undefined,
    once: boolean
  ): void {
    let eventObservers = this.observers[eventName];
    if (eventObservers == undefined) {
      eventObservers = this.observers[eventName] = new Map();
    }

    if (callback == undefined) return;

    const observer = new Observer(callback, once);
    if (scope == undefined) {
      eventObservers.set(callback, observer);
    } else {
      eventObservers.set(scope, observer);
    }
  }

  on<EventName extends keyof T>(eventName: EventName, callback?: Callback<T[EventName]>, scope?: object): void {
    this.addObserver(eventName, callback, scope, false);
  }

  once<EventName extends keyof T>(eventName: EventName, callback?: Callback<T[EventName]>, scope?: object): void {
    this.addObserver(eventName, callback, scope, true);
  }

  off<EventName extends keyof T>(eventName: EventName, scope?: object): void {
    const eventObservers = this.observers[eventName];

    if (eventObservers == undefined) {
      throw new Error(`Event "${String(eventName)}" has not been registered.`);
    }

    if (scope == undefined) {
      eventObservers.clear();
      return;
    }

    if (!eventObservers.has(scope)) {
      throw new Error(
        `Cannot delete scope "${scope}" for event "${String(eventName)}".\n` +
          `Reason: Scope "${scope}" does not exist in event "${String(eventName)}".`
      );
    } else {
      eventObservers.delete(scope);
    }
  }

  clear<EventName extends keyof T>(): void {
    Object.keys(this.observers).forEach((key) => {
      this.off(key as EventName);
    });
  }

  fire<EventName extends keyof T>(eventName: EventName, values: T[EventName]): void {
    const eventObservers = this.observers[eventName];

    if (eventObservers == undefined) {
      throw new Error(`Event "${String(eventName)}" has not been registered.`);
    }

    eventObservers.forEach((event, scope) => {
      event.callback.call(scope, values);
      if (event.once) this.off(eventName, scope);
    });
  }

  fireScope<EventName extends keyof T>(eventName: EventName, values: T[EventName], scope: object): void {
    const eventObservers = this.observers[eventName];

    if (eventObservers == undefined) {
      throw new Error(`Event "${String(eventName)}" has not been registered.`);
    }

    const event = eventObservers.get(scope);

    if (event == undefined) {
      throw new Error(
        `Cannot fire scope "${scope}" for event "${String(eventName)}".\n` +
          `Reason: Scope "${scope}" does not exist in event "${String(eventName)}".`
      );
    }

    event.callback.call(scope, values);
    if (event.once) this.off(eventName, scope);
  }

  get debugCallbacks(): Observers<T> {
    return this.observers;
  }
}
