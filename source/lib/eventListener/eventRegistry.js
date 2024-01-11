export class EventRegistry {
  listener;
  name;
  callback;
  scope;
  once

  constructor(listener, name, callback, scope, once = false) {
    this.listener = listener;
    this.name = name;
    this.callback = callback;
    this.scope = scope;
    this.once = once;
  }
}
