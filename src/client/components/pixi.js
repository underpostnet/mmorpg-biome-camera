const pixiDim = 1200;
const pixiMovementWidth = pixiDim / matrixCellsMovement;

const app = new PIXI.Application({
  width: pixiDim,
  height: pixiDim,
  background: 'gray',
});

const pixi = {};

append(
  '.matrix',
  html`
    <style>
      .pixi-canvas-container {
        top: 0px;
        left: 0px;
      }
    </style>
    <style class="css-controller-pixi"></style>
  `
);

s('.matrix').appendChild(app.view);
s('canvas').classList.add('abs');
s('canvas').classList.add('pixi-canvas-container');

window.logicStorage['renderControllerInstance']['pixi'] = () =>
  htmls(
    '.css-controller-pixi',
    css`
      .pixi-canvas-container {
        width: ${matrixWidth}px;
        height: ${matrixWidth}px;
      }
    `
  );

window.logicStorage['updateElement']['pixi'] = (type, element) => {
  if (!pixi[type]) pixi[type] = {};
  if (!pixi[type][element.id]) pixi[type][element.id] = {};

  const containerId = 'container';
  if (!pixi[type][element.id][containerId]) {
    pixi[type][element.id][containerId] = new PIXI.Container();
    pixi[type][element.id][containerId].width = pixiMovementWidth;
    pixi[type][element.id][containerId].height = pixiMovementWidth;
    app.stage.addChild(pixi[type][element.id][containerId]);
  }
  pixi[type][element.id][containerId].x = element.x * pixiMovementWidth;
  pixi[type][element.id][containerId].y = element.y * pixiMovementWidth;

  element.components.map((component) => {
    switch (component.id) {
      case 'background':
        if (!pixi[type][element.id][component.id]) {
          pixi[type][element.id][component.id] = new PIXI.Sprite(PIXI.Texture.WHITE);
          pixi[type][element.id][component.id].x = 0;
          pixi[type][element.id][component.id].y = 0;
          pixi[type][element.id][component.id].width = pixiMovementWidth;
          pixi[type][element.id][component.id].height = pixiMovementWidth;
          pixi[type][element.id][component.id].tint = component.color;
          pixi[type][element.id][containerId].addChild(pixi[type][element.id][component.id]);
        }
        break;

      default:
        break;
    }
  });
};

console.log('pixi', pixi);
