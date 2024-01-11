import { EventListener } from "./eventListener/eventListener";

export class TimelineEventListener extends EventListener {
  constructor() {
    super();
    this.add('start');
    this.add('running');
    this.add('complete');
  }

  add(name, callback, scope) {
    if (name != 'start' && name != 'running' && name != 'complete') {
      throw new Error(`'${name}'の値は不正です。nameはstart,running,complete以外使用することは出来ません。`);
    }

    super.add(name, callback, scope);
  }

  once(name, callback, scope) {
    if (name != 'start' && name != 'running' && name != 'complete') {
      throw new Error(`'${name}'の値は不正です。nameはstart,running,complete以外使用することは出来ません。`);
    }

    super.once(name, callback, scope);
  }

  init() {
    this.clear();
    this.add('start');
    this.add('running');
    this.add('complete');
  }
}
