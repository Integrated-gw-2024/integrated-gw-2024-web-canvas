export function svgViewBoxSizeAnalyzer(svgDocument: Document): { width: number; height: number } {
  const svgElements = svgDocument.querySelector("svg");
  if (svgElements == undefined) {
    throw new Error("'svgElements' is undefined'");
  }

  const viewBox = svgElements.getAttribute("viewBox");
  if (viewBox == undefined) {
    throw new Error("'viewBox' is undefined");
  }

  const viewBoxValues = viewBox.split(" ").map((param) => +param);
  const svgViewBoxSize = {
    width: viewBoxValues[2],
    height: viewBoxValues[3],
  };

  return svgViewBoxSize;
}
