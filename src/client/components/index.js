const mapCellsInstences = 1;
const mapCellsMovement = 16 * mapCellsInstences;
const mapCellsPaint = 3;
const mapCellsSize = mapCellsMovement * mapCellsPaint;
const mapCellsRange = mapCellsSize - 1;
const mapCellsAmplitudeFactor = 1;

append(
  'body',
  html`<strong> C Y B E R I A</strong>

    <style>
      body {
        background: black;
        color: white;
        font-family: monospace;
      }
      .matrix {
        background: gray;
      }
      .matrix-cell {
        border: 1px solid yellow;
        box-sizing: border-box;
      }
    </style>

    <style class="css-controller"></style>

    <div class="fix center matrix">
      <div class="in matrix-render"></div>
    </div> `
);

const matrixRender = () =>
  htmls(
    '.matrix-render',
    range(0, mapCellsRange)
      .map(
        (y) =>
          html`<div class="fl">
            ${range(0, mapCellsRange)
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
      .join('')
  );

matrixRender();

const cssControllerInstance = (screenDim) => {
  const matrixFactor = screenDim.minValue * mapCellsAmplitudeFactor;
  htmls(
    '.css-controller',
    css`
      .matrix {
        width: ${matrixFactor}px;
        height: ${matrixFactor}px;
      }
      .matrix-cell {
        width: ${matrixFactor / mapCellsSize}px;
        height: ${matrixFactor / mapCellsSize}px;
      }
    `
  );
};
(function () {
  let lastScreenDimMin;
  let lastScreenDimMax;
  const cssController = () => {
    const screenDim = dimState();
    if (lastScreenDimMin !== screenDim.minValue || lastScreenDimMax !== screenDim.maxValue) {
      lastScreenDimMin = newInstance(screenDim.minValue);
      lastScreenDimMax = newInstance(screenDim.maxValue);
      cssControllerInstance(screenDim);
    }
  };
  cssController();
  setInterval(() => cssController(), 100);
})();
