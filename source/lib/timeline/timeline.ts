import { SetExIndex } from "../expansionArray/setExIndex";

export class Timeline {
  private timelineParallel: Map<string, SetExIndex<TimelineObject>>;

  constructor() {
    this.timelineParallel = new Map();
  }
}

export class TimelineObject {}
