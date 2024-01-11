import p5 from "p5";
import * as TweenAnime from "../lib/tweenAnime/tweenAnime";

/*engine*/
import { World } from "./engine/core/world";
import { Entity } from "./engine/entity/entity";
import { Component } from "./engine/entity/components/component";

/*components*/
import { Position } from "./engine/entity/components/position";
import { ViewPosition } from "./engine/entity/components/viewPosition";
import { Rect } from "./engine/entity/components/displayable/shapes/rect";
import { Circle } from "./engine/entity/components/displayable/shapes/circle";
import { Tween } from "./engine/entity/components/tween";

/*userComponent*/
import { TakeInHTMLElement } from "./users/components/takeInHTMLElement";

/*elementLoader*/
import { loadCanvas } from "../lib/elementLoader/loadCanvas";
import { loadElement } from "../lib/elementLoader/loadElement";

/*svgLoader*/
import { loadSVGFile } from "../lib/svgLoader/loadSVGFile";
import { loadSVGFiles } from "../lib/svgLoader/loadSVGFile";
import { svgCirclesAnalyzer } from "../lib/svgLoader/svgCircleAnalyzer";
import { svgViewBoxSizeAnalyzer } from "../lib/svgLoader/svgViewBoxSizeAnalyzer";
//type
import { AnalyzedSvgCircle } from "../lib/svgLoader/svgCircleAnalyzer";

/*colorConverter*/
import { colorCodeToRGB } from "../lib/colorConverter/colorCodeToRGB";
import { rgbToHsb } from "../lib/colorConverter/rgbToHsb";

/*sectionChecker*/
import { SectionChecker } from "./users/other/scrollEvent";

/*svgDocumentToP5*/
import { SvgCirclesFitRect } from "./users/other/svgDocumentToP5/svgCirclesFitRect";
import { P5CircleData } from "./users/other/svgDocumentToP5/svgDocumentToP5CirclesData";

/*displayable*/
import { Color } from "./engine/entity/components/displayable/displayable";

export const sketch = (p5: p5): void => {
  let world: World;
  let scroll: Scroll;
  let sectionChecker: SectionChecker;

  let entity: Entity;

  p5.setup = (): void => {
    world = new World(p5);
    world.systems.canvas.adjustElement = loadCanvas("#canvas_size");
    world.systems.canvas.ratio = { width: 16, height: 9 };

    world.systems.camera.position.y = window.scrollY;
    window.addEventListener("scroll", () => {
      world.systems.camera.position.y = window.scrollY;
    });

    entity = new Entity();
    entity.addComponent(new Position({ x: 300, y: 700 }));
    entity.addComponent(new Circle({ diameter: 20, colorMode: "hsb" }));
    entity.addComponent(new Circle({ diameter: 80, fill: null, stroke: new Color(255, 0, 0, 255) }));
    entity.addComponent(new Tween());
    entity
      .getComponent(Tween)
      .createTween(entity.getComponent(Position), "x", 300, 800, TweenAnime.Easing.easeInOutCubic);
    entity
      .getComponent(Tween)
      .createTween(entity.getComponent(Position), "y", 300, 1000, TweenAnime.Easing.easeInCubic);
    entity.getComponent(Tween).createTween(entity.getComponent(Circle).fill!, "v1", 0, 100);
    world.addEntity(entity);

    const htmlElementEntities = new HtmlElementEntities(world);
    htmlElementEntities.addHtmlElement("#test_div");
    htmlElementEntities.addHtmlElement("#test_div2");
    htmlElementEntities.addHtmlElement("#test_div3");
    htmlElementEntities.addHtmlElement("#test_div4");

    const svgLoader = new SVGsLoader();
    svgLoader.addSerialNumberPath("source/svg/section_0/", ".svg", 4);
    svgLoader.addSerialNumberPath("source/svg/section_1/", ".svg", 1);
    svgLoader.addSerialNumberPath("source/svg/section_2/", ".svg", 4);
    svgLoader.addSerialNumberPath("source/svg/section_0/", ".svg", 4);

    sectionChecker = new SectionChecker(world, 500, 0.5);
    const testSections = document.querySelectorAll(".test_section");
    for (const testSection of testSections) {
      const sectionEntity = new Entity();

      sectionEntity.addComponent(new Position());

      const takeInHTMLElement = new TakeInHTMLElement(testSection as HTMLElement);
      takeInHTMLElement.rect.isDisplayable = false;
      sectionEntity.addComponent(takeInHTMLElement);

      world.addEntity(sectionEntity);
      sectionChecker.add(sectionEntity);
    }

    svgLoader.allLoad().then((svgDocuments) => {
      console.log(svgDocuments);
      scroll = new Scroll(world, sectionChecker, htmlElementEntities, svgDocuments);
    });
  };

  p5.draw = (): void => {
    p5.colorMode("rgb");
    p5.clear();
    p5.background(100, 50);

    sectionChecker.display(p5);
    world.update();
  };
};

class SVGsLoader {
  public readonly svgFilesPath: Array<Array<string>>;

  constructor() {
    this.svgFilesPath = [];
  }

  addSerialNumberPath(baseUrl: string, extension: string, count: number): void {
    const result: Array<string> = [];
    for (let i = 0; i < count; i++) {
      result.push(baseUrl + i + extension);
    }

    this.svgFilesPath.push(result);
  }

  async allLoad(): Promise<Array<Array<Document>>> {
    const result: Array<Array<Document>> = [];

    for (const sectionSvgFiles of this.svgFilesPath) {
      await loadSVGFiles(sectionSvgFiles)
        .then((svgDocuments) => {
          result.push(svgDocuments);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    return result;
  }
}

class HtmlElementEntities {
  /*class*/
  private readonly world: World;
  /*variable*/
  public readonly entities: Array<Entity>;

  constructor(world: World) {
    this.world = world;
    this.entities = [];
  }

  addHtmlElement(classOrId: string): void {
    const htmlEntity = new Entity();
    htmlEntity.addComponent(new Position());
    htmlEntity.addComponent(new TakeInHTMLElement(classOrId));

    this.entities.push(htmlEntity);
    this.world.addEntity(htmlEntity);
  }
}

class Scroll {
  /*class*/
  private readonly sectionChecker: SectionChecker;
  private readonly entityScheduler: EntityScheduler;
  private readonly htmlElementEntities: HtmlElementEntities;
  /*variable*/
  private readonly svgDocuments: Array<Array<Document>>;
  private previousData: { index: Array<number>; currentSectionScrollY: number; currentSectionHeight: number };

  constructor(
    world: World,
    sectionChecker: SectionChecker,
    htmlElementEntities: HtmlElementEntities,
    svgDocuments: Array<Array<Document>>
  ) {
    this.sectionChecker = sectionChecker;
    this.htmlElementEntities = htmlElementEntities;
    this.svgDocuments = svgDocuments;
    this.previousData = this.sectionChecker.checkCurrentSection();

    this.entityScheduler = new EntityScheduler(
      world,
      new SvgCirclesFitRect(
        this.svgDocuments[this.previousData.index[0]][0],
        this.htmlElementEntities.entities[this.previousData.index[0]]
      )
    );
    /*
    this.entityScheduler.newTween(new SvgCirclesFitRect(
      this.svgDocuments[this.previousData.index[0] + 1][0],
      this.htmlElementEntities.entities[this.previousData.index[0] + 1]
    ));
    */

    window.addEventListener("scroll", () => {
      const data = this.sectionChecker.checkCurrentSection();
      const progressRate = data.currentSectionScrollY / data.currentSectionHeight;

      if (data.index.length == 2) {
        if (this.previousData.index.length != data.index.length) {
          console.log("a");
          this.entityScheduler.newTween(
            new SvgCirclesFitRect(this.svgDocuments[data.index[0]][0], this.htmlElementEntities.entities[data.index[0]]),
            new SvgCirclesFitRect(this.svgDocuments[data.index[1]][0], this.htmlElementEntities.entities[data.index[1]])
          );
          this.previousData = data;
          console.log(this.previousData.index, data.index);
        }
        this.entityScheduler.moveTween(progressRate);
      }
      if (this.previousData.index.length != data.index.length) {
        this.previousData = data;
      }
      //console.log(data.index);
    });
  }
}

class EntityScheduler implements Disposable {
  private readonly world: World;
  private readonly entityBuilder: EntityBuilder;
  private readonly spawnReserver: SpawnReserver;

  private readonly circleEntities: Array<Entity>;

  constructor(world: World, firstFrom: SvgCirclesFitRect, entityBuilder = new EntityBuilder()) {
    this.world = world;
    this.entityBuilder = entityBuilder;
    this.spawnReserver = new SpawnReserver(world);

    this.circleEntities = [];
    this.setup(firstFrom);
  }

  private setup(firstFrom: SvgCirclesFitRect): void {
    const originalFromData = firstFrom.calculateCirclesData();

    for (const fromData of originalFromData) {
      const entity = this.createSpawnData(fromData);
      this.entityBuilder.initSettingsEntity(entity);
      this.circleEntities.push(entity);
      this.world.addEntity(entity);
    }
  }

  public newTween(
    from: SvgCirclesFitRect,
    to: SvgCirclesFitRect,
    easing: TweenAnime.Easing = TweenAnime.Easing.linear
  ): void {
    this.spawnReserver.clear();
    const originalToData = to.calculateCirclesData();
    const originalFromData = from.calculateCirclesData();

    if (originalToData.length > this.circleEntities.length) {
      let queueFromData = originalFromData.concat();

      const gap = originalToData.length - this.circleEntities.length;
      for (let i = 0; i < gap; i++) {
        const fromData = queueFromData.splice(0, 1)[0];
        const entity = this.createSpawnData(fromData);
        this.entityBuilder.initSettingsEntity(entity);
        this.circleEntities.push(entity);
        this.spawnReserver.addSpawnReserve(Array.of(entity));

        if (queueFromData.length <= 0) {
          queueFromData = originalFromData.concat();
        }
      }
    }
    this.createTween(originalFromData, originalToData, easing);
  }

  private createSpawnData(spawnData: P5CircleData): Entity {
    const entity = new Entity();
    const position = new Position();
    const circle = new Circle();

    position.x = spawnData.position.x;
    position.y = spawnData.position.y;
    circle.diameter = spawnData.diameter;
    circle.strokeWeight = spawnData.strokeWeight;
    circle.colorMode = spawnData.colorMode;

    const fill = spawnData.fill;
    if (fill == null) {
      circle.fill = null;
    } else {
      new Color(fill.v1, fill.v2, fill.v3, fill.a);
    }

    const stroke = spawnData.stroke;
    if (stroke == null) {
      circle.stroke = null;
    } else {
      new Color(stroke.v1, stroke.v2, stroke.v3, stroke.a);
    }

    entity.addComponent(position);
    entity.addComponent(circle);

    return entity;
  }

  private createTween(
    originalFrom: P5CircleData[],
    originalTo: P5CircleData[],
    easing: TweenAnime.Easing
  ): P5CircleData[] {
    let queueToData = originalTo.concat();
    let queueFromData = originalFrom.concat();

    for (const circleEntity of this.circleEntities) {
      const entityPosition = circleEntity.getComponent(Position);
      const entityCircle = circleEntity.getComponent(Circle);

      if (circleEntity.hasComponent(Tween)) {
        circleEntity.removeComponent(circleEntity.getComponent(Tween));
      }
      const entityTween = new Tween();
      circleEntity.addComponent(entityTween);

      const toData = queueToData.splice(getRandomInt(0, queueToData.length), 1)[0];
      const fromData = queueFromData.splice(0, 1)[0];
      entityTween.createTween(entityPosition, "x", fromData.position.x, toData.position.x, easing);
      entityTween.createTween(entityPosition, "y", fromData.position.y, toData.position.y, easing);
      entityTween.createTween(entityCircle, "diameter", fromData.diameter, toData.diameter, easing);
      entityTween.createTween(entityCircle, "strokeWeight", fromData.strokeWeight, toData.strokeWeight, easing);

      if (entityCircle.fill == undefined) {
        entityCircle.fill = new Color(0, 0, 0, 0);
      }
      let fromFill = fromData.fill;
      if (fromFill == undefined) {
        fromFill = new Color(0, 0, 0, 0);
      }
      let toFill = toData.fill;
      if (toFill == undefined) {
        toFill = new Color(0, 0, 0, 0);
      }
      entityTween.createTween(entityCircle.fill, "v1", fromFill.v1, toFill.v1, easing);
      entityTween.createTween(entityCircle.fill, "v2", fromFill.v2, toFill.v2, easing);
      entityTween.createTween(entityCircle.fill, "v3", fromFill.v3, toFill.v3, easing);
      entityTween.createTween(entityCircle.fill, "a", fromFill.a, toFill.a, easing);

      if (entityCircle.stroke == undefined) {
        entityCircle.stroke = new Color(0, 0, 0, 0);
      }
      let fromStroke = fromData.stroke;
      if (fromStroke == undefined) {
        fromStroke = new Color(0, 0, 0, 0);
      }
      let toStroke = toData.stroke;
      if (toStroke == undefined) {
        toStroke = new Color(0, 0, 0, 0);
      }
      entityTween.createTween(entityCircle.stroke, "v1", fromStroke.v1, toStroke.v1, easing);
      entityTween.createTween(entityCircle.stroke, "v2", fromStroke.v2, toStroke.v2, easing);
      entityTween.createTween(entityCircle.stroke, "v3", fromStroke.v3, toStroke.v3, easing);
      entityTween.createTween(entityCircle.stroke, "a", fromStroke.a, toStroke.a, easing);

      if (queueFromData.length <= 0) {
        queueFromData = originalFrom.concat();
      }
      if (queueToData.length <= 0) {
        queueToData = originalTo.concat();
      }
    }

    return queueToData;
  }

  public moveTween(progressRate: number): void {
    if (this.spawnReserver.hasReserve()) this.spawnReserver.spawn();
    for (const entity of this.circleEntities) {
      entity.getComponent(Tween).setProgress(progressRate);
    }
  }

  [Symbol.dispose](): void {}
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

interface ComponentSetting {
  setup(): Component[];
}

class EntityBuilder {
  private readonly componentSettings: ComponentSetting[];
  constructor() {
    this.componentSettings = [];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public addComponentSettings(...componentSetting: ComponentSetting[]): void {
    this.componentSettings.push(...componentSetting);
  }

  public createEntity(): Entity {
    const entity = new Entity();

    this.componentSettings.forEach((componentSetting) => {
      const components = componentSetting.setup();
      components.forEach((component) => {
        entity.addComponent(component);
      });
    });

    return entity;
  }

  /**
   * 渡されたentityをcomponentSettingsに登録されたcomponentで上書きします。
   * componentが複数ある場合getComponentで取得できるcomponentが上書きされます。
   */
  public initSettingsEntity(entity: Entity): Entity {
    this.componentSettings.forEach((componentSetting) => {
      const components = componentSetting.setup();
      components.forEach((component) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const componentConstructor = component.constructor as new (...arg: any) => Component;
        if (entity.hasComponent(componentConstructor)) {
          entity.removeComponent(entity.getComponent(componentConstructor));
        }
        entity.addComponent(component);
      });
    });

    return entity;
  }
}

class SpawnReserver {
  private readonly world: World;
  private readonly reserveEntities: Array<Entity>;

  constructor(world: World) {
    this.world = world;
    this.reserveEntities = [];
  }

  public addSpawnReserve(entity: Entity[]): void {
    this.reserveEntities.push(...entity);
  }

  public hasReserve(): boolean {
    if (this.reserveEntities.length > 0) {
      return true;
    }

    return false;
  }

  public clear(): void {
    this.reserveEntities.splice(0);
  }

  public spawn(): Entity[] {
    for (const entity of this.reserveEntities) {
      this.world.addEntity(entity);
    }

    const result = this.reserveEntities.splice(0, this.reserveEntities.length);
    return result;
  }
}
