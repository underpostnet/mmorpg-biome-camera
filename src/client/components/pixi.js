const pixi = {
  Data: {
    dim: 3000,
    elements: {},
    sprites: {},
    floor: {},
  },
  Intervals: {
    elements: {},
  },
  init: function () {
    this.app = new PIXI.Application({
      width: this.Data.dim,
      height: this.Data.dim,
      background: 'gray',
    });
    this.Data.floor.container = new PIXI.Container();
    this.Data.floor.container.width = this.Data.dim;
    this.Data.floor.container.height = this.Data.dim;
    this.Data.floor.container.x = 0;
    this.Data.floor.container.y = 0;
    this.app.stage.addChild(this.Data.floor.container);
    this.setFloor();
  },
  setFloor: function () {
    if (this.Data.floor.sprite) this.Data.floor.sprite.destroy();
    this.Data.floor.sprite = PIXI.Sprite.from(`/biomes/${biomeID.split('-')[0]}/${biomeID}/${biomeID}.png`);
    this.Data.floor.sprite.width = this.Data.dim;
    this.Data.floor.sprite.height = this.Data.dim;
    this.Data.floor.sprite.x = 0;
    this.Data.floor.sprite.y = 0;
    this.Data.floor.container.addChild(this.Data.floor.sprite);
  },
  appendInitHtml: function (container) {
    s(container).appendChild(this.app.view);
    s('canvas').classList.add('abs');
    s('canvas').classList.add('grid-container-canvas');
  },
  remove: function (type, element, indexElement) {
    Object.keys(this.Data.elements[type][indexElement]).map((pixiKey) =>
      this.Data.elements[type][indexElement][pixiKey].destroy()
    );
    this.Data.elements[type].splice(indexElement, 1);
    Object.keys(this.Intervals.elements[type][indexElement]).map((interval) =>
      clearInterval(this.Intervals.elements[type][indexElement][interval])
    );
    this.Intervals.elements[type].splice(indexElement, 1);
    this.Data.sprites[type].splice(indexElement, 1);
  },
  removeAll: function () {
    Object.keys(this.Data.elements).map((type) => {
      this.Data.elements[type].map((element, indexElement) => {
        Object.keys(element).map((pixiKey) => this.Data.elements[type][indexElement][pixiKey].destroy());
      });
    });
    this.Data.elements = {};
    Object.keys(this.Intervals.elements).map((type) => {
      this.Intervals.elements[type].map((element, indexElement) => {
        Object.keys(element).map((interval) => clearInterval(this.Intervals.elements[type][indexElement][interval]));
      });
    });
    this.Intervals.elements = {};
    this.Data.sprites = {};
  },
  update: function (type, element, indexElement, direction) {
    if (!this.Data.elements[type]) this.Data.elements[type] = [];
    if (!this.Data.elements[type][indexElement]) this.Data.elements[type][indexElement] = {};

    if (!this.Intervals.elements[type]) this.Intervals.elements[type] = [];
    if (!this.Intervals.elements[type][indexElement]) this.Intervals.elements[type][indexElement] = {};

    if (!this.Data.sprites[type]) this.Data.sprites[type] = [];
    if (!this.Data.sprites[type][indexElement]) this.Data.sprites[type][indexElement] = [];

    // container
    if (!this.Data.elements[type][indexElement].container) {
      this.Data.elements[type][indexElement].container = new PIXI.Container();
      this.Data.elements[type][indexElement].container.width = (this.Data.dim / matrixCells) * element.dimFactor;
      this.Data.elements[type][indexElement].container.height = (this.Data.dim / matrixCells) * element.dimFactor;
      this.app.stage.addChild(this.Data.elements[type][indexElement].container);
    }
    this.Data.elements[type][indexElement].container.x = element.x * (this.Data.dim / matrixCells);
    this.Data.elements[type][indexElement].container.y = element.y * (this.Data.dim / matrixCells);
    if (indexElement === 0) grid.viewMatrixController();
    // components
    element.components.map((component) => {
      if (!component.active) return;
      switch (component.id) {
        case 'background':
          if (!this.Data.elements[type][indexElement][component.id]) {
            this.Data.elements[type][indexElement][component.id] = new PIXI.Sprite(PIXI.Texture.WHITE);
            this.Data.elements[type][indexElement][component.id].x = 0;
            this.Data.elements[type][indexElement][component.id].y = 0;
            this.Data.elements[type][indexElement][component.id].width =
              (this.Data.dim / matrixCells) * element.dimFactor;
            this.Data.elements[type][indexElement][component.id].height =
              (this.Data.dim / matrixCells) * element.dimFactor;
            this.Data.elements[type][indexElement][component.id].tint = component.color;
            this.Data.elements[type][indexElement][component.id].visible = component.visible;
            this.Data.elements[type][indexElement].container.addChild(
              this.Data.elements[type][indexElement][component.id]
            );
          }
          break;
        case 'skins':
          component.positions.map((position) => {
            Object.keys(position.sprites).map((sprite) => {
              range(0, position.sprites[sprite].frames).map((frame) => {
                const src = `/skins/${component.skin}/${position.sprites[sprite].id}/${frame}.png`;
                if (!this.Data.elements[type][indexElement][src]) {
                  console.warn('load sprite', src);
                  this.Data.elements[type][indexElement][src] = PIXI.Sprite.from(src);
                  this.Data.elements[type][indexElement][src].x = 0;
                  this.Data.elements[type][indexElement][src].y = 0;
                  this.Data.elements[type][indexElement][src].width = (this.Data.dim / matrixCells) * element.dimFactor;
                  this.Data.elements[type][indexElement][src].height =
                    (this.Data.dim / matrixCells) * element.dimFactor;
                  this.Data.elements[type][indexElement][src].visible =
                    position.directions.includes(element.direction) && sprite === 'stop' && frame === 0;
                  this.Data.elements[type][indexElement].container.addChild(
                    this.Data.elements[type][indexElement][src]
                  );
                  this.Data.sprites[type][indexElement].push(src);
                }
              });
            });
          });
          if (direction) {
            Object.keys(this.Intervals.elements[type][indexElement]).map((interval) => {
              if (interval !== direction && this.Intervals.elements[type][indexElement][interval]) {
                clearInterval(this.Intervals.elements[type][indexElement][interval]);
                delete this.Intervals.elements[type][indexElement][interval];
              }
            });

            if (!this.Intervals.elements[type][indexElement][direction]) {
              const clearSprites = () => {
                this.Data.sprites[type][indexElement].map((src) => {
                  this.Data.elements[type][indexElement][src].visible = false;
                });
              };
              clearSprites();

              const dataComponent = socketIo.Data.elements[type][indexElement].components.find((c) => c.id === 'skins');
              const dataPosition = dataComponent.positions.find((c) => c.directions.includes(direction));

              let frame = 0;
              this.Data.elements[type][indexElement][
                `/skins/${dataComponent.skin}/${dataPosition.sprites.mov.id}/${frame}.png`
              ].visible = component.visible;

              let originX = newInstance(element.x);
              let originY = newInstance(element.y);

              this.Intervals.elements[type][indexElement][direction] = setInterval(() => {
                this.Data.elements[type][indexElement][
                  `/skins/${dataComponent.skin}/${dataPosition.sprites.mov.id}/${frame}.png`
                ].visible = false;
                if (frame === dataPosition.sprites.mov.frames) frame = -1;
                frame++;
                this.Data.elements[type][indexElement][
                  `/skins/${dataComponent.skin}/${dataPosition.sprites.mov.id}/${frame}.png`
                ].visible = component.visible;

                if (
                  socketIo.Data.elements[type][indexElement].x === originX &&
                  socketIo.Data.elements[type][indexElement].y === originY
                ) {
                  clearInterval(this.Intervals.elements[type][indexElement][direction]);
                  delete this.Intervals.elements[type][indexElement][direction];
                  clearSprites();
                  this.Data.elements[type][indexElement][
                    `/skins/${dataComponent.skin}/${dataPosition.sprites.stop.id}/0.png`
                  ].visible = component.visible;
                } else {
                  originX = newInstance(socketIo.Data.elements[type][indexElement].x);
                  originY = newInstance(socketIo.Data.elements[type][indexElement].y);
                }
              }, dataComponent.frameInterval);
            }
          }

          break;
        case 'life-bar':
          if (!this.Data.elements[type][indexElement][component.id]) {
            this.Data.elements[type][indexElement][component.id] = new PIXI.Sprite(PIXI.Texture.WHITE);
            this.Data.elements[type][indexElement][component.id].x = 0;
            this.Data.elements[type][indexElement][component.id].y = 0;
            this.Data.elements[type][indexElement][component.id].height =
              (this.Data.dim / matrixCells) * element.dimFactor * 0.2;
            this.Data.elements[type][indexElement][component.id].tint = 'green';
            this.Data.elements[type][indexElement][component.id].visible = component.visible;
            this.Data.elements[type][indexElement].container.addChild(
              this.Data.elements[type][indexElement][component.id]
            );
          }
          this.Data.elements[type][indexElement][component.id].width =
            (this.Data.dim / matrixCells) * element.dimFactor * (element.life / element.maxLife);
          break;
        default:
          break;
      }
    });
  },
};

pixi.init();
