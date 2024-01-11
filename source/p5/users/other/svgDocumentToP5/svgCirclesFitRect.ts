/*class*/
import { Entity } from "../../../engine/entity/entity";
import { ViewPosition } from "../../../engine/entity/components/viewPosition";
import { Rect } from "../../../engine/entity/components/displayable/shapes/rect";
/*type*/
import { ColorMode } from "../../../engine/entity/components/displayable/displayable";
import { P5CircleData } from "./svgDocumentToP5CirclesData";
/*function*/
import { svgViewBoxSizeAnalyzer } from "../../../../lib/svgLoader/svgViewBoxSizeAnalyzer";
import { svgDocumentToP5CirclesData } from "./svgDocumentToP5CirclesData";

export class SvgCirclesFitRect {
  private svgDocument: Document;
  private readonly sizeApplyEntity: Entity;

  constructor(svgDocument: Document, sizeApplyEntity: Entity) {
    if (!sizeApplyEntity.hasComponent(Rect)) {
      throw new Error("必ずRectを含めたentityを渡すようにしてください。");
    }

    this.svgDocument = svgDocument;

    this.sizeApplyEntity = sizeApplyEntity;
  }

  calculateCirclesData(colorMode: ColorMode = "hsb"): P5CircleData[] {
    /**svgデータ取得*/
    const viewBoxSize = svgViewBoxSizeAnalyzer(this.svgDocument);
    const circles = svgDocumentToP5CirclesData(this.svgDocument, colorMode);

    /**svgデータがsizeApplyEntityにぴったり収まる縮小率を計算します*/
    const div = {
      x: this.sizeApplyEntity.getComponent(ViewPosition).x,
      y: this.sizeApplyEntity.getComponent(ViewPosition).y,
      width: this.sizeApplyEntity.getComponent(Rect).width,
      height: this.sizeApplyEntity.getComponent(Rect).height,
    };

    const divSizeRatio = div.width / div.height;
    const viewBoxSizeRatio = viewBoxSize.width / viewBoxSize.height;

    let scaleRatio = 1;
    if (viewBoxSizeRatio < divSizeRatio) {
      scaleRatio = div.height / viewBoxSize.height;
    }
    if (viewBoxSizeRatio > divSizeRatio) {
      scaleRatio = div.width / viewBoxSize.width;
    }

    /**計算した縮小率をsvgの各種パラメーターに掛けて補正します*/
    circles.forEach((circle, index) => {
      const horizontalCenter = div.width / 2 - (viewBoxSize.width * scaleRatio) / 2 + div.x;
      const verticalCenter = div.height / 2 - (viewBoxSize.height * scaleRatio) / 2 + div.y;

      circles[index].position.x = circle.position.x * scaleRatio + horizontalCenter;
      circles[index].position.y = circle.position.y * scaleRatio + (window.scrollY + verticalCenter);
      circles[index].diameter = circle.diameter * scaleRatio;
      circles[index].strokeWeight = circle.strokeWeight * scaleRatio;
    });

    return circles;
  }
}
