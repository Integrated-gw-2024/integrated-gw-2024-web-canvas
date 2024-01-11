import { TimelineEventListener } from "./timelineEventListener";
import { SetExIndex } from "./expansionArray/setExIndex";

export class Timeline {
  event;
  #timelineParallel;
  currentFrame;
  currentIndex;

  constructor() {
    this.event = new TimelineEventListener();

    this.#timelineParallel = new Map();
    this.currentFrame = 0;
    this.currentIndex = 0;
  }

  get size() {
    return this.#timelineParallel.size
  }

  /**
   * TimelineもしくはTimelineObjectを追加します
   * Timelineクラスは入れ子状に追加していく事が可能です。
   */
  add(name, timeline) {
    if (timeline instanceof Timeline) {
      if (timeline.size == 0) {
        throw new Error('timelineが空のtimelineをaddすることは出来ません。')
      }
    }

    if (!this.#timelineParallel.has(name)) {
      this.#timelineParallel.set(name, new SetExIndex());
    }

    this.#timelineParallel.get(name).add(timeline);
  }

  /**
   * 指定した名前のTimeline、TimelineObjectを取得します。
   * 返される値はTimelineが実行される順のSetExIndexによって拡張されたSet配列が返されます。
   * 拡張Set配列はget(name).get(index)のようにインデックス番号で指定することが出来ます。
   * 詳しい内容はsetExIndexを参照してください。
   */
  get(name) {
    return this.#timelineParallel.get(name);
  }

  /**
   * 全てのTimeline、TimelineObject、eventを消去します。
   * clear()した場合eventを再利用することは出来ません。再度登録してください。
   */
  clear() {
    this.#timelineParallel.forEach((timelineSerial) => {
      timelineSerial.forEach((timeline) => {
        if (timeline == undefined) return;
        timeline.event.clear();
        if (timeline instanceof Timeline) timeline.clear();
      })
      timelineSerial.clear();
    })

    this.#timelineParallel.clear();
    this.event.init()
  }

  /**
   * 指定された名前のTimeline、TimelineObject、eventを消去します。
   * 指定された名前自身も消去される点に注意してください。
   * clear()した場合eventを再利用することは出来ません。再度登録してください。
   */
  remove(name) {
    if (!this.#timelineParallel.has(name)) {
      console.error(`'${name}'タイムラインは存在しないため削除できませんでした。`);
      return;
    }

    this.#timelineParallel.get(name).forEach((timeline) => {
      timeline.event.clear();
      if (timeline instanceof Timeline) timeline.clear();
    })

    this.#timelineParallel.get(name).clear();
    this.#timelineParallel.delete(name);
  }

  /**
   * currentFrameを次へと進めます。
   * 内部にtimelineもしくはtimelineObjectが存在する場合、それらも同時に次のフレームへと進めます
   */
  next() {
    if (this.isComplete()) return;

    if (this.currentFrame == 0) this.event.dispatch('start');

    let parallelAllCompleat = true;
    this.#timelineParallel.forEach((timelineSerial) => {
      if (timelineSerial.get(this.currentIndex) == undefined) return;

      timelineSerial.get(this.currentIndex).next();

      if (timelineSerial.get(this.currentIndex).isComplete()) return;

      parallelAllCompleat = false;
    })

    this.event.dispatch('running');

    if (parallelAllCompleat) this.currentIndex++;

    if (this.isComplete()) {
      this.event.dispatch('complete');
      return;
    }

    this.currentFrame++;
  }

  /**
   * このインスタンスに含まれたすべてのTimeline、TimelineObjectの経過時間をリセットします。
   */
  reset() {
    this.#timelineParallel.forEach((timelineSerial) => {
      timelineSerial.forEach((timeline) => {
        if (timeline == undefined) return;
        timeline.reset();
      }) 
    })
    this.currentFrame = 0;
    this.currentIndex = 0;
  }

  /**
   * このインスタンスに含まれたすべてのTimeline、TimelineObjectが実行完了したかをbool型で返します。
   */
  isComplete() {
    let parallelMaxSize = 0;
    this.#timelineParallel.forEach((timeline) => {
      if (parallelMaxSize < timeline.size) parallelMaxSize = timeline.size;
    })

    return (this.currentIndex >= parallelMaxSize);
  }
}

export { TimelineObject } from './timelineObject.js'
