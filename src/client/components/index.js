const matrixCellsInstances = 1;
const matrixCellsMovement = 16 * matrixCellsInstances;
const matrixCellsMovementRange = matrixCellsMovement - 1;
const matrixCellsPaint = 3;
const matrixCellsSize = matrixCellsMovement * matrixCellsPaint;
const matrixCellsRange = matrixCellsSize - 1;
const matrixCellsAmplitudeFactor = 1;
let matrixCellsWidth;
let matrixCellsMovementSize;
let matrixWidth;

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
      }
      .matrix-render-movement {
        top: 0px;
        left: 0px;
      }
    </style>

    <style class="css-controller"></style>

    <div class="fix center matrix">
      <svg class="abs matrix-cell-svg" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>
      <div class="abs matrix-render"></div>
      <div class="abs matrix-render-movement"></div>
    </div> `
);

const matrixRender = () => {
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

const elements = {
  user: [{ id: `user${s4()}`, x: 1, y: 1 }],
};

console.log('elements', elements);

const renderControllerInstance = (screenDim) => {
  matrixWidth = screenDim.minValue * matrixCellsAmplitudeFactor;
  matrixCellsWidth = matrixWidth / matrixCellsSize;
  matrixCellsMovementSize = matrixCellsWidth * matrixCellsPaint;
  htmls(
    '.css-controller',
    css`
      .matrix {
        width: ${matrixWidth}px;
        height: ${matrixWidth}px;
      }
      .matrix-cell {
        width: ${matrixCellsWidth}px;
        height: ${matrixCellsWidth}px;
      }
      .matrix-cell-movement {
        width: ${matrixCellsMovementSize}px;
        height: ${matrixCellsMovementSize}px;
      }
    `
  );
  s('.matrix-cell-svg').setAttribute('width', screenDim.minValue);
  s('.matrix-cell-svg').setAttribute('height', screenDim.minValue);
  Object.keys(elements).map((type) =>
    elements[type].map((element) => {
      if (!s(`.${element.id}-background`)) {
        append(
          '.matrix-cell-svg',
          html`
            <!-- 
      stroke="red"
      stroke-width="0" 
          -->
            <rect
              class="${element.id}-background"
              width="${matrixCellsMovementSize}"
              height="${matrixCellsMovementSize}"
              stroke-linecap="square"
              x="${element.x * matrixCellsMovementSize}"
              y="${element.y * matrixCellsMovementSize}"
              style="fill: red"
            />
          `
        );
      } else {
        s(`.${element.id}-background`).setAttribute('width', matrixCellsMovementSize);
        s(`.${element.id}-background`).setAttribute('height', matrixCellsMovementSize);
        s(`.${element.id}-background`).setAttribute('x', element.x * matrixCellsMovementSize);
        s(`.${element.id}-background`).setAttribute('y', element.y * matrixCellsMovementSize);
      }
    })
  );
};
(function () {
  let lastScreenDimMin;
  let lastScreenDimMax;
  const renderController = () => {
    const screenDim = dimState();
    if (lastScreenDimMin !== screenDim.minValue || lastScreenDimMax !== screenDim.maxValue) {
      lastScreenDimMin = newInstance(screenDim.minValue);
      lastScreenDimMax = newInstance(screenDim.maxValue);
      renderControllerInstance(screenDim);
    }
  };
  renderController();
  setInterval(() => renderController(), 15);
})();
