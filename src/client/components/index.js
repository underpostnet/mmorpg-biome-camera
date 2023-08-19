const mapCellsMovement = 16;
const mapCellsPaint = 3;
const mapCellsSize = mapCellsMovement * mapCellsPaint;
const mapCellsRange = mapCellsSize - 1;

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
        margin: auto;
        background: gray;
      }
      .matrix-cell {
        border: 1px solid yellow;
        box-sizing: border-box;
      }
    </style>

    <style class="css-controller"></style>

    <div class="in matrix">
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

const cssControllerInstance = (screenDim) =>
  htmls(
    '.css-controller',
    css`
      .matrix {
        width: ${screenDim.minValue}px;
        height: ${screenDim.minValue}px;
      }
      .matrix-cell {
        width: ${screenDim.minValue / mapCellsSize}px;
        height: ${screenDim.minValue / mapCellsSize}px;
      }
    `
  );

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
