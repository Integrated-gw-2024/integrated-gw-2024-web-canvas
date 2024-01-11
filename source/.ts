
class EntityScheduler implements Disposable {
  private readonly world: World;
  private readonly circlesDataSchedule: Array<SvgCirclesFitRect>;
  private readonly ballEntities: Array<Entity>;

  private tween: {
    position: { x: TweenAnime.Tween; y: TweenAnime.Tween };
    diameter: TweenAnime.Tween;
    strokeWeight: TweenAnime.Tween;
    fill: { h: TweenAnime.Tween; s: TweenAnime.Tween; b: TweenAnime.Tween; a: TweenAnime.Tween };
    stroke: { h: TweenAnime.Tween; s: TweenAnime.Tween; b: TweenAnime.Tween; a: TweenAnime.Tween };
  } | null;
  private lastTweenProgress: number;
  public currentSection: number;
  public nextSection: number;

  constructor(world: World) {
    this.world = world;
    this.circlesDataSchedule = [];
    this.ballEntities = [];

    this.tween = null;
    this.currentSection = 0;
    this.nextSection = 1;
    this.lastTweenProgress = 0;

    this.world.systems.canvas.event.on(
      "resize",
      () => {
        this.resize();
        this.newTween();
        this.moveTween(this.lastTweenProgress);
      },
      this
    );
  }

  public addSchedule(circles: SvgCirclesFitRect): void {
    console.log(circles);
    this.circlesDataSchedule.push(circles);
  }

  public spawn(): void {
    const circlesData = this.circlesDataSchedule[this.currentSection].calculateCirclesData();

    for (const circle of circlesData) {
      const entity = new Entity();
      entity.addComponent(new Position({ x: circle.position.x, y: circle.position.y }));

      entity.addComponent(
        new Circle({
          diameter: circle.diameter,
          colorMode: "hsb",
          fill: circle.fill,
          stroke: circle.stroke,
          strokeWeight: circle.strokeWeight,
        })
      );

      this.world.addEntity(entity);
      this.ballEntities.push(entity);
    }
  }

  public newTween(): void {
    const froms: {
      position: { x: Array<number>; y: Array<number> };
      diameter: Array<number>;
      strokeWeight: Array<number>;
      fill: { h: Array<number>; s: Array<number>; b: Array<number>; a: Array<number> };
      stroke: { h: Array<number>; s: Array<number>; b: Array<number>; a: Array<number> };
    } = {
      position: {
        x: [],
        y: [],
      },
      diameter: [],
      strokeWeight: [],
      fill: { h: [], s: [], b: [], a: [] },
      stroke: { h: [], s: [], b: [], a: [] },
    };

    const tos: {
      position: { x: Array<number>; y: Array<number> };
      diameter: Array<number>;
      strokeWeight: Array<number>;
      fill: { h: Array<number>; s: Array<number>; b: Array<number>; a: Array<number> };
      stroke: { h: Array<number>; s: Array<number>; b: Array<number>; a: Array<number> };
    } = {
      position: { x: [], y: [] },
      diameter: [],
      strokeWeight: [],
      fill: { h: [], s: [], b: [], a: [] },
      stroke: { h: [], s: [], b: [], a: [] },
    };

    let queueNextData = this.circlesDataSchedule[this.nextSection].calculateCirclesData();
    if (queueNextData.length <= this.ballEntities.length) {
      for (const ballEntity of this.ballEntities) {
        const entityPosition = ballEntity.getComponent(Position);
        const entityCircle = ballEntity.getComponent(Circle);

        froms.position.x.push(entityPosition.x);
        froms.position.y.push(entityPosition.y);
        froms.diameter.push(entityCircle.diameter);
        if (entityCircle.strokeWeight == null) {
          froms.strokeWeight.push(0);
        } else {
          froms.strokeWeight.push(entityCircle.strokeWeight);
        }
        if (entityCircle.fill == null) {
          froms.fill.h.push(0);
          froms.fill.s.push(0);
          froms.fill.b.push(0);
          froms.fill.a.push(0);
        } else {
          froms.fill.h.push(entityCircle.fill.v1);
          froms.fill.s.push(entityCircle.fill.v2);
          froms.fill.b.push(entityCircle.fill.v3);
          froms.fill.a.push(entityCircle.fill.a);
        }
        if (entityCircle.stroke == null) {
          froms.stroke.h.push(0);
          froms.stroke.s.push(0);
          froms.stroke.b.push(0);
          froms.stroke.a.push(0);
        } else {
          froms.stroke.h.push(entityCircle.stroke.v1);
          froms.stroke.s.push(entityCircle.stroke.v2);
          froms.stroke.b.push(entityCircle.stroke.v3);
          froms.stroke.a.push(entityCircle.stroke.a);
        }

        const tosData = queueNextData.splice(getRandomInt(0, queueNextData.length - 1), 1)[0];

        tos.position.x.push(tosData.position.x);
        tos.position.y.push(tosData.position.y);
        tos.diameter.push(tosData.diameter);
        tos.strokeWeight.push(tosData.strokeWeight);
        const hsbFill = tosData.fill;
        if (hsbFill == null) throw new Error("hsbFill is null");
        tos.fill.h.push(hsbFill.v1);
        tos.fill.s.push(hsbFill.v2);
        tos.fill.b.push(hsbFill.v3);
        tos.fill.a.push(hsbFill.a);
        const hsbStroke = tosData.stroke;
        if (hsbStroke == null) throw new Error("hsbStroke is null");
        tos.stroke.h.push(hsbStroke.v1);
        tos.stroke.s.push(hsbStroke.v2);
        tos.stroke.b.push(hsbStroke.v3);
        tos.stroke.a.push(hsbStroke.a);

        if (queueNextData.length <= 0) {
          queueNextData = this.circlesDataSchedule[this.nextSection].calculateCirclesData();
        }
      }
    }

    console.log(froms);

    this.tween = {
      position: {
        x: new TweenAnime.Tween(froms.position.x, tos.position.x, TweenAnime.Easing.linear),
        y: new TweenAnime.Tween(froms.position.y, tos.position.y, TweenAnime.Easing.linear),
      },
      diameter: new TweenAnime.Tween(froms.diameter, tos.diameter, TweenAnime.Easing.linear),
      strokeWeight: new TweenAnime.Tween(froms.strokeWeight, tos.strokeWeight, TweenAnime.Easing.linear),
      fill: {
        h: new TweenAnime.Tween(froms.fill.h, tos.fill.h, TweenAnime.Easing.linear),
        s: new TweenAnime.Tween(froms.fill.s, tos.fill.s, TweenAnime.Easing.linear),
        b: new TweenAnime.Tween(froms.fill.b, tos.fill.b, TweenAnime.Easing.linear),
        a: new TweenAnime.Tween(froms.fill.a, tos.fill.a, TweenAnime.Easing.linear),
      },
      stroke: {
        h: new TweenAnime.Tween(froms.stroke.h, tos.stroke.h, TweenAnime.Easing.linear),
        s: new TweenAnime.Tween(froms.stroke.s, tos.stroke.s, TweenAnime.Easing.linear),
        b: new TweenAnime.Tween(froms.stroke.b, tos.stroke.b, TweenAnime.Easing.linear),
        a: new TweenAnime.Tween(froms.stroke.a, tos.stroke.a, TweenAnime.Easing.linear),
      },
    };
  }

  public moveTween(progressRate: number): void {
    this.ballEntities.forEach((ballEntity, index) => {
      if (this.tween == null) return;

      const position = ballEntity.getComponent(Position);
      const circle = ballEntity.getComponent(Circle);

      position.x = this.tween.position.x.getIndexValue(index, progressRate);
      position.y = this.tween.position.y.getIndexValue(index, progressRate);
      circle.diameter = this.tween.diameter.getIndexValue(index, progressRate);
      circle.strokeWeight = this.tween.strokeWeight.getIndexValue(index, progressRate);
      circle.fill = {
        v1: this.tween.fill.h.getIndexValue(index, progressRate),
        v2: this.tween.fill.s.getIndexValue(index, progressRate),
        v3: this.tween.fill.b.getIndexValue(index, progressRate),
        a: this.tween.fill.a.getIndexValue(index, progressRate),
      };
      circle.stroke = {
        v1: this.tween.stroke.h.getIndexValue(index, progressRate),
        v2: this.tween.stroke.s.getIndexValue(index, progressRate),
        v3: this.tween.stroke.b.getIndexValue(index, progressRate),
        a: this.tween.stroke.a.getIndexValue(index, progressRate),
      };
    });

    this.lastTweenProgress = progressRate;
  }

  private resize(): void {
    const circlesData = this.circlesDataSchedule[this.currentSection].calculateCirclesData();

    this.ballEntities.forEach((ballEntity, index) => {
      const entityPosition = ballEntity.getComponent(Position);
      const entityCircle = ballEntity.getComponent(Circle);

      entityPosition.x = circlesData[index].position.x;
      entityPosition.y = circlesData[index].position.y;

      entityCircle.diameter = circlesData[index].diameter;
      entityCircle.strokeWeight = circlesData[index].strokeWeight;

      const hsbFill = circlesData[index].fill;
      if (hsbFill == null) {
        entityCircle.fill = null;
      } else {
        entityCircle.fill = { v1: hsbFill.v1, v2: hsbFill.v2, v3: hsbFill.v3, a: 1 };
      }

      const strokeFill = circlesData[index].stroke;
      if (strokeFill == null) {
        entityCircle.stroke = null;
      } else {
        entityCircle.stroke = { v1: strokeFill.v1, v2: strokeFill.v2, v3: strokeFill.v3, a: 1 };
      }
    });
  }

  [Symbol.dispose](): void {
    this.world.systems.canvas.event.off("resize", this);
  }
}

