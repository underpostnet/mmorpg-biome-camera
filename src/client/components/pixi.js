const pixi = {
  Data: {
    dim: 1200,
    elements: {},
    floor: {},
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

    this.Data.floor.sprite = PIXI.Sprite.from(`/biomes/${biomeID}/${biomeID}.png`);
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
  },
  removeAll: function () {
    Object.keys(this.Data.elements).map((type) => {
      this.Data.elements[type].map((element, indexElement) => {
        Object.keys(element).map((pixiKey) => this.Data.elements[type][indexElement][pixiKey].destroy());
      });
    });
    this.Data.elements = {};
  },
  update: function (type, element, indexElement) {
    if (!this.Data.elements[type]) this.Data.elements[type] = [];
    if (!this.Data.elements[type][indexElement]) this.Data.elements[type][indexElement] = {};

    // container
    if (!this.Data.elements[type][indexElement].container) {
      this.Data.elements[type][indexElement].container = new PIXI.Container();
      this.Data.elements[type][indexElement].container.width = this.Data.dim / matrixCells;
      this.Data.elements[type][indexElement].container.height = this.Data.dim / matrixCells;
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
            this.Data.elements[type][indexElement][component.id].width = this.Data.dim / matrixCells;
            this.Data.elements[type][indexElement][component.id].height = this.Data.dim / matrixCells;
            this.Data.elements[type][indexElement][component.id].tint = component.color;
            this.Data.elements[type][indexElement][component.id].visible = component.visible;
            this.Data.elements[type][indexElement].container.addChild(
              this.Data.elements[type][indexElement][component.id]
            );
          }
          break;

        default:
          break;
      }
    });
  },
};

pixi.init();
