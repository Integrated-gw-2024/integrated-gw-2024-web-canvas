/*function*/
import { svgCirclesAnalyzer } from "../../../../lib/svgLoader/svgCircleAnalyzer";
import { colorCodeToRGB } from "../../../../lib/colorConverter/colorCodeToRGB";
import { rgbToHsb } from "../../../../lib/colorConverter/rgbToHsb";
/*type*/
import { ColorMode, ColorParameter, Color } from "../../../engine/entity/components/displayable/displayable";

export type P5CircleData = {
  position: {
    x: number;
    y: number;
  };
  diameter: number;
  colorMode: ColorMode;
  fill: ColorParameter;
  stroke: ColorParameter;
  strokeWeight: number;
};

export function svgDocumentToP5CirclesData(svgDocument: Document, colorMode: ColorMode = "hsb"): P5CircleData[] {
  const analyzedSvgCircles = svgCirclesAnalyzer(svgDocument);

  const circles: P5CircleData[] = [];

  for (const analyzedSvgCircle of analyzedSvgCircles) {
    const position = analyzedSvgCircle.position;
    const diameter = analyzedSvgCircle.radius * 2;
    const strokeWeight = analyzedSvgCircle.strokeWeight;

    let fill: ColorParameter;
    let stroke: ColorParameter;
    switch (colorMode) {
      case "rgb": {
        const rgbFill = colorCodeToRGB(analyzedSvgCircle.fill);
        const rgbStroke = colorCodeToRGB(analyzedSvgCircle.stroke);
        fill = new Color(rgbFill.r, rgbFill.g, rgbFill.b, 1);
        stroke = new Color(rgbStroke.r, rgbStroke.g, rgbStroke.b, 1);
        break;
      }
      case "hsb": {
        const hsbFill = rgbToHsb(colorCodeToRGB(analyzedSvgCircle.fill));
        const hsbStroke = rgbToHsb(colorCodeToRGB(analyzedSvgCircle.stroke));
        fill = new Color(hsbFill.h, hsbFill.s * 100, hsbFill.b * 100, 1);
        stroke = new Color(hsbStroke.h, hsbStroke.s * 100, hsbStroke.b * 100, 1);
        break;
      }
    }

    const circle: P5CircleData = {
      position: position,
      diameter: diameter,
      colorMode: colorMode,
      fill: fill,
      stroke: stroke,
      strokeWeight: strokeWeight,
    };

    circles.push(circle);
  }

  return circles;
}
