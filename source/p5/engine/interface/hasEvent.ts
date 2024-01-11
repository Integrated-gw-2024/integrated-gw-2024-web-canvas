import { Emitter } from "../../../lib/emitter/emitter";

export interface HasEvent<T extends object> {
  readonly event: Emitter<T>;
}
