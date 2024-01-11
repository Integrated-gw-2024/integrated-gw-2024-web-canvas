export function loadElement(element: HTMLElement | string): HTMLElement {
  let result: HTMLElement | null = null;
  if (typeof element == "string") {
    result = document.querySelector(element);
  } else if (element instanceof HTMLElement) {
    result = element;
  }

  if (result === null) {
    throw new Error("Elementを取得できませんでした。");
  }

  return result;
}
