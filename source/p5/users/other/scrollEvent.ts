import p5 from "p5";

import { World } from "../../engine/core/world";
import { Entity } from "../../engine/entity/entity";
import { Rect } from "../../engine/entity/components/displayable/shapes/rect";
import { ViewPosition } from "../../engine/entity/components/viewPosition";

export class SectionChecker {
  private readonly world: World;
  private readonly sectionEntities: Array<Entity>;

  public gap: number;
  /**float min 0 ~ max 1 */
  public detectionLine: number;

  constructor(world: World, gap = 0, detectionLine = 0) {
    this.world = world;
    this.sectionEntities = [];

    this.gap = gap;
    this.detectionLine = detectionLine;
  }

  public add(sectionEntity: Entity): void {
    if (!sectionEntity.hasComponent(Rect)) {
      throw new Error("必ずRectを含めたentityを渡すようにしてください。");
    }

    this.sectionEntities.push(sectionEntity);
  }

  public checkCurrentSection(): {
    index: number[];
    currentSectionHeight: number;
    currentSectionScrollY: number;
  } {
    const canvasClientRect = this.world.systems.canvas.canvasElement.getBoundingClientRect();
    const detectionLine =
      this.world.systems.camera.position.y +
      canvasClientRect.y +
      this.world.systems.canvas.canvasElement.height * this.detectionLine;

    let index = 0;
    let accumulateHeight = 0;
    let currentIndexHeight = 0;
    let isInTopGap = false;
    let isInBottomGap = false;
    for (const sectionEntity of this.sectionEntities) {
      const rect = sectionEntity.getComponent(Rect);
      const currentIndexTop = accumulateHeight;
      const currentIndexBottom = accumulateHeight + rect.height;
      currentIndexHeight = rect.height;

      if (detectionLine < currentIndexBottom) {
        if (detectionLine < currentIndexTop + this.gap / 2) {
          isInTopGap = true;
        }
        if (detectionLine > currentIndexBottom - this.gap / 2) {
          isInBottomGap = true;
        }
        break;
      }

      accumulateHeight += rect.height;
      index++;
    }

    if (isInTopGap) {
      return {
        index: [index - 1, index],
        currentSectionHeight: this.gap,
        currentSectionScrollY: detectionLine - accumulateHeight + this.gap / 2,
      };
    }

    if (isInBottomGap) {
      return {
        index: [index, index + 1],
        currentSectionHeight: this.gap,
        currentSectionScrollY:
          detectionLine - (accumulateHeight + currentIndexHeight - this.gap / 2),
      };
    }

    return {
      index: [index],
      currentSectionHeight: currentIndexHeight - this.gap,
      currentSectionScrollY: detectionLine - accumulateHeight - this.gap / 2,
    };
  }

  display(p5: p5): void {
    for (const sectionEntity of this.sectionEntities) {
      const position = sectionEntity.getComponent(ViewPosition);
      const rect = sectionEntity.getComponent(Rect);
      const canvasWidth = this.world.systems.canvas.canvasElement.width;

      p5.colorMode("rgb");
      p5.stroke(255, 0, 0);
      p5.strokeWeight(2);

      const topLinePosition = position.y + this.gap / 2;
      const bottomLinePosition = position.y + rect.height - this.gap / 2;
      p5.line(0, topLinePosition, canvasWidth, topLinePosition);
      p5.line(0, bottomLinePosition, canvasWidth, bottomLinePosition);

      p5.stroke(0, 255, 0);
      const detectionLinePosition =
        this.world.systems.canvas.canvasElement.height * this.detectionLine;
      p5.line(0, detectionLinePosition, canvasWidth, detectionLinePosition);
    }
  }
}
