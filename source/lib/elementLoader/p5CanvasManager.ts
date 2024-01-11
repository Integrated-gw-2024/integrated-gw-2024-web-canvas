import p5 from "p5";

export class P5CanvasManager {
  public readonly adjustElement: HTMLElement;
  private p5: p5;

  public ratio: {
    width: number;
    height: number;
  } | null;

  constructor(p5: p5, adjustElement: HTMLElement, waitTime = 500) {
    this.adjustElement = adjustElement;
    this.p5 = p5;
    this.ratio = null;

    p5.createCanvas(p5.windowWidth, p5.windowHeight);

    ((): void => {
      let queue: NodeJS.Timeout;
      window.addEventListener("resize", () => {
        clearTimeout(queue);
        queue = setTimeout(this.resize, waitTime);
      });
    })();
  }

  resize(): void {
    const elementRatio = this.adjustElement.clientWidth / this.adjustElement.clientHeight;

    if (this.ratio == null) {
      this.p5.resizeCanvas(this.adjustElement.clientWidth, this.adjustElement.clientHeight);
      return;
    }

    if (this.ratio.width / this.ratio.height < elementRatio) {
      this.p5.resizeCanvas(
        (this.adjustElement.clientHeight / this.ratio.height) * this.ratio.width,
        this.adjustElement.clientHeight
      );
    } else if (this.ratio.width / this.ratio.height > elementRatio) {
      this.p5.resizeCanvas(
        this.adjustElement.clientWidth,
        (this.adjustElement.clientWidth / this.ratio.width) * this.ratio.height
      );
    } else {
      this.p5.resizeCanvas(this.adjustElement.clientHeight, this.adjustElement.clientHeight);
    }
  }
}
