export type AnalyzedSvgCircle = {
  position: {
    x: number,
    y: number,
  },
  radius: number,
  /** #16進数 */
  fill: string,
  /** #16進数 */
  stroke: string,
  strokeWeight: number,
}

export function svgCirclesAnalyzer(svgDocument: Document): AnalyzedSvgCircle[] {
  const circles: AnalyzedSvgCircle[] = [];

  const svgElements = svgDocument.querySelector('svg');
  if (svgElements == undefined) {
    throw new Error("'svgElements' is Undefined'");
  }
  const circleElements = svgElements.querySelectorAll('circle');

  for (const circleElement of circleElements) {
    const positionX = Number(attributeNullCheck(circleElement, ('cx')));
    const positionY = Number(attributeNullCheck(circleElement, ('cy')));
    const radius = Number(attributeNullCheck(circleElement, ('r')));
    const fill = attributeNullCheck(circleElement, ('fill'));
    const stroke = attributeNullCheck(circleElement, ('stroke'));
    const strokeWeight = Number(attributeNullCheck(circleElement, ('stroke-width')));

    const circle: AnalyzedSvgCircle = {
      position: {
        x: positionX,
        y: positionY,
      },
      radius: radius,
      fill: fill,
      stroke: stroke,
      strokeWeight: strokeWeight
    };

    circles.push(circle);
  }

  return circles;
}

function attributeNullCheck(svgElement: SVGCircleElement, attribute: string): string {
  const result = svgElement.getAttribute(attribute);

  if (result == null) {
    throw new Error('attribute data is null');
  }

  return result;
}
