const grid = {
  Data: {
    grids: ['grid-container', 'grid-container-paint', 'grid-container-canvas'],
  },
  init: function () {
    append(
      'body',
      html`
        <style>
          grid {
            top: 0%;
            left: 0%;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          .grid-cell-paint {
            box-sizing: border-box;
            border: 1px solid yellow;
          }
          .grid-cell {
            box-sizing: border-box;
            border: 1px solid black;
          }
        </style>
        <grid class="abs"> </grid>
      `
    );
    pixi.appendInitHtml('grid');
    append(
      'grid',
      html`
        <style class="css-controller-grid"></style>
        <div class="abs grid-container-paint">
          ${range(0, matrixCells * matrixCellsPaintByCell - 1)
            .map(
              (y) =>
                html`<div class="fl">
                  ${range(0, matrixCells * matrixCellsPaintByCell - 1)
                    .map((x) => html`<div class="in fll grid-cell-paint"></div>`)
                    .join('')}
                </div>`
            )
            .join('')}
        </div>
        <div class="abs grid-container">
          ${range(0, matrixCells - 1)
            .map(
              (y) =>
                html`<div class="fl">
                  ${range(0, matrixCells - 1)
                    .map(
                      (x) =>
                        html`<div
                          class="in fll grid-cell"
                          ${x === 1 && y === 1 ? 'style="background: red"' : ''}
                        ></div>`
                    )
                    .join('')}
                </div>`
            )
            .join('')}
        </div>
      `
    );

    index.ResponsiveController.Event['grid'] = () => {
      this.viewMatrixController();
    };
  },
  viewMatrixController: function () {
    const ResponsiveData = index.ResponsiveController.getResponsiveData();
    const ResponsiveDataAmplitude = index.ResponsiveController.getResponsiveDataAmplitude();

    // matrixCells

    const x = 1;
    const y = 1;

    if (ResponsiveData.minType === 'height') {
      this.Data.grids.map((gridId) => {
        s(`.${gridId}`).style.left = `${
          ResponsiveData.maxValue / 2 -
          (ResponsiveDataAmplitude.minValue / matrixCells) * x -
          ResponsiveDataAmplitude.minValue / matrixCells / 2
        }px`;
        s(`.${gridId}`).style.top = `${
          ResponsiveData.minValue / 2 -
          (ResponsiveDataAmplitude.minValue / matrixCells) * y -
          ResponsiveDataAmplitude.minValue / matrixCells / 2
        }px`;
      });
    } else {
      this.Data.grids.map((gridId) => {
        s(`.${gridId}`).style.left = `${
          ResponsiveData.minValue / 2 -
          (ResponsiveDataAmplitude.minValue / matrixCells) * x -
          ResponsiveDataAmplitude.minValue / matrixCells / 2
        }px`;
        s(`.${gridId}`).style.top = `${
          ResponsiveData.maxValue / 2 -
          (ResponsiveDataAmplitude.minValue / matrixCells) * y -
          ResponsiveDataAmplitude.minValue / matrixCells / 2
        }px`;
      });
    }

    htmls(
      '.css-controller-grid',
      css`
        ${this.Data.grids
          .map(
            (gridId) => css`
              .${gridId} {
                width: ${ResponsiveDataAmplitude.minValue}px;
                height: ${ResponsiveDataAmplitude.minValue}px;
              }
            `
          )
          .join('')}
        .grid-cell {
          width: ${ResponsiveDataAmplitude.minValue / matrixCells}px;
          height: ${ResponsiveDataAmplitude.minValue / matrixCells}px;
        }
        .grid-cell-paint {
          width: ${ResponsiveDataAmplitude.minValue / (matrixCells * matrixCellsPaintByCell)}px;
          height: ${ResponsiveDataAmplitude.minValue / (matrixCells * matrixCellsPaintByCell)}px;
        }
      `
    );
  },
};

grid.init();

append(
  'body',
  html` <div class="fix center" style="width: 20px; height: 20px; background: yellow; border: 2px solid black;"></div> `
);
