const matrixCellsInstances = 3;
const matrixCellsMovement = 16 * matrixCellsInstances;
const matrixCellsMovementRange = matrixCellsMovement - 1;
const matrixCellsPaint = 3;
const matrixCellsSize = matrixCellsMovement * matrixCellsPaint;
const matrixCellsRange = matrixCellsSize - 1;
const matrixCellsAmplitudeFactor = 4;
const matrixCellsZindex = 1;
let matrixCellsWidth;
let matrixCellsMovementSize;
let matrixCellsView = false;
let matrixCellsMovementView = false;

let matrixWidth;
let lastScreenDim = {};
window.activeKey = {};
window.logicStorage = {
  renderControllerInstance: {},
  updateElement: {},
};

window.onkeydown = (e) => (console.log('onkeydown', e.key), (window.activeKey[e.key] = true));
window.onkeyup = (e) => (console.log('onkeyup', e.key), (window.activeKey[e.key] = undefined));

append(
  'body',
  html`<strong> C Y B E R I A</strong>

    <style>
      body {
        background: black;
        color: white;
        font-family: monospace;
      }
      .matrix-cell-svg {
        background: gray;
        top: 0px;
        left: 0px;
      }
      .matrix-cell {
        border: 1px solid yellow;
        box-sizing: border-box;
      }
      .matrix-cell-movement {
        border: 1px solid black;
        box-sizing: border-box;
      }
      .matrix-render {
        top: 0px;
        left: 0px;
        z-index: ${matrixCellsZindex};
      }
      .matrix-render-movement {
        top: 0px;
        left: 0px;
        z-index: ${matrixCellsZindex};
      }
    </style>

    <style class="css-controller"></style>

    <div class="fix matrix">
      <svg class="abs matrix-cell-svg" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>
      <div class="abs matrix-render"></div>
      <div class="abs matrix-render-movement"></div>
    </div> `
);

const matrixRender = () => {
  if (matrixCellsView)
    htmls(
      '.matrix-render',
      html`
        ${range(0, matrixCellsRange)
          .map(
            (y) =>
              html`<div class="fl">
                ${range(0, matrixCellsRange)
                  .map(
                    (x) => html`
                      <div class="in fll matrix-cell">
                        <!-- ${x}-${y} -->
                      </div>
                    `
                  )
                  .join('')}
              </div>`
          )
          .join('')}
      `
    );
  if (matrixCellsMovementView)
    htmls(
      '.matrix-render-movement',
      html`
        ${range(0, matrixCellsMovementRange)
          .map(
            (y) =>
              html`<div class="fl">
                ${range(0, matrixCellsMovementRange)
                  .map(
                    (x) => html`
                      <div class="in fll matrix-cell-movement">
                        <!-- ${x}-${y} -->
                      </div>
                    `
                  )
                  .join('')}
              </div>`
          )
          .join('')}
      `
    );
};

matrixRender();

const components = {
  background: {
    width: () => matrixCellsMovementSize,
    height: () => matrixCellsMovementSize,
    x: (element) => element.x * matrixCellsMovementSize,
    y: (element) => element.y * matrixCellsMovementSize,
  },
  'eye-right': {
    width: () => matrixCellsMovementSize * 0.25,
    height: () => matrixCellsMovementSize * 0.25,
    x: (element) => element.x * matrixCellsMovementSize + matrixCellsMovementSize * 0.2,
    y: (element) => element.y * matrixCellsMovementSize + matrixCellsMovementSize * 0.2,
  },
  'eye-left': {
    width: () => matrixCellsMovementSize * 0.25,
    height: () => matrixCellsMovementSize * 0.25,
    x: (element) =>
      element.x * matrixCellsMovementSize +
      (matrixCellsMovementSize - matrixCellsMovementSize * 0.2 - matrixCellsMovementSize * 0.25),
    y: (element) => element.y * matrixCellsMovementSize + matrixCellsMovementSize * 0.2,
  },
};

const elements = {
  user: [
    {
      id: `user${s4()}`,
      x: 1,
      y: 1,
      vel: 0.3,
      components: [
        { id: 'background', color: 'red' },
        { id: 'eye-right', color: 'blue' },
        { id: 'eye-left', color: 'blue' },
      ],
    },
  ],
  bot: () =>
    range(0, 100).map(() => {
      return {
        id: `bot${s4()}`,
        x: random(0, matrixCellsMovementRange),
        y: random(0, matrixCellsMovementRange),
        vel: 0.1,
        components: [
          { id: 'background', color: ['yellow', 'green', 'pink', 'purple'][random(0, 3)] },
          { id: 'eye-right', color: 'black' },
          { id: 'eye-left', color: 'black' },
        ],
      };
    }),
  building: () =>
    range(0, 10).map(() => {
      return {
        id: `building${s4()}`,
        x: random(0, matrixCellsMovementRange),
        y: random(0, matrixCellsMovementRange),
        vel: 0.1,
        components: [{ id: 'background', color: 'black' }],
      };
    }),
};

console.log('elements', elements);

const updateElement = (type, element) => {
  element.components.map((component) => {
    if (s(`.${element.id}-${component.id}`)) {
      s(`.${element.id}-${component.id}`).setAttribute('width', components[component.id].width());
      s(`.${element.id}-${component.id}`).setAttribute('height', components[component.id].height());
      s(`.${element.id}-${component.id}`).setAttribute('x', components[component.id].x(element));
      s(`.${element.id}-${component.id}`).setAttribute('y', components[component.id].y(element));
    }
    Object.keys(window.logicStorage['updateElement']).map((key) =>
      window.logicStorage['updateElement'][key](type, element)
    );
  });
};

const renderControllerInstance = () => {
  matrixWidth = lastScreenDim.minValue * matrixCellsAmplitudeFactor;
  matrixCellsWidth = matrixWidth / matrixCellsSize;
  matrixCellsMovementSize = matrixCellsWidth * matrixCellsPaint;

  let cssRender = '';
  if (s('.matrix'))
    cssRender += css`
      .matrix {
        width: ${matrixWidth}px;
        height: ${matrixWidth}px;
      }
    `;
  if (s('.matrix-cell'))
    cssRender += css`
      .matrix-cell {
        width: ${matrixCellsWidth}px;
        height: ${matrixCellsWidth}px;
      }
    `;
  if (s('.matrix-cell-movement'))
    cssRender += css`
      .matrix-cell-movement {
        width: ${matrixCellsMovementSize}px;
        height: ${matrixCellsMovementSize}px;
      }
    `;

  htmls('.css-controller', cssRender);

  Object.keys(window.logicStorage['renderControllerInstance']).map((key) =>
    window.logicStorage['renderControllerInstance'][key]()
  );

  s('.matrix-cell-svg').setAttribute('width', matrixWidth);
  s('.matrix-cell-svg').setAttribute('height', matrixWidth);
  Object.keys(elements).map((type) => {
    if (typeof elements[type] === 'function') elements[type] = elements[type]();
    elements[type].map((element) => updateElement(type, element));
  });
};

(function () {
  const renderController = () => {
    const screenDim = dimState();
    if (lastScreenDim.minValue !== screenDim.minValue || lastScreenDim.maxValue !== screenDim.maxValue) {
      lastScreenDim = newInstance(screenDim);
      renderControllerInstance();
    }
  };
  setTimeout(() => {
    renderController();
    Object.keys(elements).map((type) =>
      elements[type].map((element) => {
        element.components.map((component) => {
          return;
          append(
            '.matrix-cell-svg',
            html`
              <rect
                class="${element.id}-${component.id}"
                width="${components[component.id].width()}"
                height="${components[component.id].height()}"
                stroke-linecap="square"
                x="${components[component.id].x(element)}"
                y="${components[component.id].y(element)}"
                style="fill: ${component.color}"
              />
            `
          );
        });
      })
    );

    setInterval(() => {
      renderController();
      Object.keys(elements).map((type) => {
        elements[type].map((element, i) => {
          switch (type) {
            case 'bot':
              switch (random(0, 3)) {
                case 0:
                  elements[type][i].x += element.vel;
                  break;
                case 1:
                  elements[type][i].x -= element.vel;
                  break;
                case 2:
                  elements[type][i].y += element.vel;
                  break;
                case 3:
                  elements[type][i].y -= element.vel;
                  break;
                default:
                  break;
              }
              break;
            case 'user':
              switch (i) {
                case 0:
                  if (window.activeKey['ArrowRight']) elements[type][i].x += element.vel;
                  if (window.activeKey['ArrowLeft']) elements[type][i].x -= element.vel;
                  if (window.activeKey['ArrowDown']) elements[type][i].y += element.vel;
                  if (window.activeKey['ArrowUp']) elements[type][i].y -= element.vel;

                  const factorScreenAmplitude = 1 / matrixCellsAmplitudeFactor;
                  const factorScreen = (lastScreenDim.maxValue / lastScreenDim.minValue) * factorScreenAmplitude;
                  const factorScreenMin = (100 * (matrixCellsWidth / 1)) / lastScreenDim.minValue;
                  const factorScreenMax = (100 * (matrixCellsWidth / 1)) / lastScreenDim.maxValue;

                  if (lastScreenDim.minType === 'height') {
                    s('.matrix').style.left = `${
                      50 -
                      factorScreenMax -
                      factorScreenMax / 2 -
                      (elements[type][i].x * 100) / matrixCellsMovement / factorScreen
                    }%`;
                    s('.matrix').style.top = `${
                      50 -
                      factorScreenMin -
                      factorScreenMin / 2 -
                      (elements[type][i].y * 100) / matrixCellsMovement / factorScreenAmplitude
                    }%`;
                  } else {
                    s('.matrix').style.left = `${
                      50 -
                      factorScreenMin -
                      factorScreenMin / 2 -
                      (elements[type][i].x * 100) / matrixCellsMovement / factorScreenAmplitude
                    }%`;
                    s('.matrix').style.top = `${
                      50 -
                      factorScreenMax -
                      factorScreenMax / 2 -
                      (elements[type][i].y * 100) / matrixCellsMovement / factorScreen
                    }%`;
                  }

                  break;

                default:
                  break;
              }
              break;
            default:
              break;
          }
          if (elements[type][i].y > matrixCellsMovement - 1) elements[type][i].y = matrixCellsMovement - 1;
          if (elements[type][i].y < 0) elements[type][i].y = 0;
          if (elements[type][i].x > matrixCellsMovement - 1) elements[type][i].x = matrixCellsMovement - 1;
          if (elements[type][i].x < 0) elements[type][i].x = 0;

          updateElement(type, elements[[type]][i]);
        });
      });
    }, 15);
  });
})();

// center test
// append(
//   'body',
//   html` <div class="fix center" style="width: 20px; height: 20px; background: yellow; border: 2px solid black;"></div> `
// );
