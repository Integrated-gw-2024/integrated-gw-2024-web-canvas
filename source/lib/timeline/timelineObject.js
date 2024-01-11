import { TimelineEventListener } from "./timelineEventListener";

export class TimelineObject {
  event;
  duration;
  currentFrame;

  constructor(duration = 1, current = 0) {
    this.event = new TimelineEventListener();

    this.duration = duration;
    this.currentFrame = current;
  }

  next() {
    if (this.isComplete()) return;

    if (this.currentFrame == 0) this.event.dispatch('start');

    this.event.dispatch('running');

    this.currentFrame++;

    if (this.isComplete()) this.event.dispatch('complete');
  }

  reset() {
    this.currentFrame = 0;
  }

  isComplete() {
    return (this.currentFrame >= this.duration);
  }
}
