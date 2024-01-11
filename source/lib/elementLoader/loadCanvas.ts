export function loadCanvas(canvas: HTMLCanvasElement | string): HTMLCanvasElement {
  let canvasElement: HTMLCanvasElement | null = null;
  if (typeof canvas == "string") {
    canvasElement = document.querySelector(canvas);
  } else if (canvas instanceof HTMLCanvasElement) {
    canvasElement = canvas;
  }

  if (canvasElement === null) {
    throw new Error("canvasを取得できませんでした。");
  }

  return canvasElement;
}
