/*class*/
import p5 from "p5";

import { System } from "./system";
import { SystemsRegistry } from "../systemsRegistry";
import { loadCanvas } from "../../../../lib/elementLoader/loadCanvas";
import { Emitter } from "../../../../lib/emitter/emitter";

/*interface*/
import { HasEvent } from "../../interface/hasEvent";

type CanvasEvent = {
  resize: undefined;
};

export class CanvasManager extends System implements HasEvent<CanvasEvent> {
  /*public*/
  public readonly event: Emitter<CanvasEvent>;

  /*private*/
  //getter only
  private _canvasElement: HTMLCanvasElement | null;
  //has getter and setter
  private _adjustElement: HTMLElement;
  private _ratio: { width: number; height: number } | null;

  constructor(htmlElement = document.body, millis = 100) {
    super();
    this.event = new Emitter<CanvasEvent>();

    this._canvasElement = null;

    this._adjustElement = htmlElement;
    this._ratio = null;

    //millisで指定した時間が経過するまではcanvasのリサイズを実行しない。
    ((): void => {
      let queue: NodeJS.Timeout;
      window.addEventListener("resize", () => {
        clearTimeout(queue);
        queue = setTimeout(this.resize.bind(this), millis);
      });
    })();
  }

  /**
   * SystemsRegistry登録時に呼び出されます。
   * エンジン使用者が呼び出す必要はありません。
   */
  public setup(p5: p5, systems: SystemsRegistry): void {
    super.setup(p5, systems);

    this.event.on("resize");
    this.p5.createCanvas(p5.windowWidth, p5.windowHeight);
    this._canvasElement = loadCanvas("#defaultCanvas0");

    this.resize();
  }

  /**
   * canvasをリサイズすると共に、systems.event.canvasのresizeイベントを発火します。
   */
  public resize(): void {
    const elementRatio = this._adjustElement.clientWidth / this._adjustElement.clientHeight;

    if (this._ratio == null) {
      this.p5.resizeCanvas(this._adjustElement.clientWidth, this._adjustElement.clientHeight);
    } else if (this._ratio.width / this._ratio.height < elementRatio) {
      this.p5.resizeCanvas(
        (this._adjustElement.clientHeight / this._ratio.height) * this._ratio.width,
        this._adjustElement.clientHeight
      );
    } else if (this._ratio.width / this._ratio.height > elementRatio) {
      this.p5.resizeCanvas(
        this._adjustElement.clientWidth,
        (this._adjustElement.clientWidth / this._ratio.width) * this._ratio.height
      );
    } else {
      this.p5.resizeCanvas(this._adjustElement.clientWidth, this._adjustElement.clientHeight);
    }

    this.event.fire("resize", undefined);
  }

  /**
   * 値変更時、自動でcanvasがリサイズされます。
   * どのhtmlElementのサイズにcanvasのサイズを合わせるかを指定します。
   */
  set adjustElement(htmlElement) {
    this._adjustElement = htmlElement;
    this.resize();
  }

  get adjustElement(): HTMLElement {
    return this._adjustElement;
  }

  /**
   * 値変更時、自動でcanvasがリサイズされます。
   */
  set ratio(ratio) {
    if (ratio == null) {
      this._ratio = null;
    } else {
      this._ratio = { width: ratio.width, height: ratio.height };
    }

    this.resize();
  }

  get ratio(): { width: number; height: number } | null {
    return this._ratio;
  }

  get canvasElement(): HTMLCanvasElement {
    if (this._canvasElement == null) throw new Error(`canvas is '${this._canvasElement}'`);
    return this._canvasElement;
  }
}
