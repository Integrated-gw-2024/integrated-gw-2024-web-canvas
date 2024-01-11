import { EventRegistry } from "./eventRegistry";

export class EventListener {
  callbacks;

  constructor() {
    this.callbacks = new Map();
  }

  #addCallback(name, callback, scope, once) {
    if (!this.callbacks.has(name)) {
      this.callbacks.set(name, new Map());
    }
    if (callback === undefined) return;
    let event;
    if (scope === undefined) {
      event = new EventRegistry(this, name, callback, callback, once);
      this.callbacks.get(name)?.set(callback, event);
    } else {
      event = new EventRegistry(this, name, callback, scope, once);
      this.callbacks.get(name)?.set(scope, event);
    }
  }

  add(name, callback, scope) {
    this.#addCallback(name, callback, scope, false);
  }

  once(name, callback, scope) {
    this.#addCallback(name, callback, scope, true);
  }

  clear() {
    this.callbacks.clear();
  }

  remove(name, scope) {
    if (!this.callbacks.has(name)) {
      console.error(`'${name}'イベントは登録されていないため削除できません。`);
      return;
    }

    if (scope === undefined) {
      this.callbacks.delete(name);
      return;
    }

    if (!this.callbacks.get(name).has(scope)) {
      console.error(`'${scope}'は'${name}'イベントに登録されていないため削除できません。`);
    }
    this.callbacks.get(name).delete(scope);
  }

  dispatch(name, argA, argB, argC, argD, argE, argF) {
    if (!this.callbacks.has(name)) {
      throw new Error(`'${name}'イベントは登録されていません。`);
    }
    for (const key of this.callbacks.get(name).keys()) {
      const event = this.callbacks.get(name).get(key);
      event.callback.call(event.scope, argA, argB, argC, argD, argE, argF);
      
      if (event.once) {
        this.remove(name, event.scope);
      }
    }
  }

  dispatchScope(name, scope, argA, argB, argC, argD, argE, argF) {
    if (!this.callbacks.has(name)) {
      throw new Error(`'${name}'イベントは登録されていません。`);
    }

    const event = this.callbacks.get(name).get(scope);
    event.callback.call(scope, argA, argB, argC, argD, argE, argF);

    if (event.once) {
      this.remove(name, scope);
    }
  }
}
