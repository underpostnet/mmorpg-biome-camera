const grid = {
  Data: {
    grids: ['grid-container-canvas', 'grid-container-svg'],
  },
  TestController: {
    Data: {
      active: false,
      forcePositionActive: false,
      forcePosition: {
        x: 0,
        y: 0,
      },
      x: function () {
        if (socketIo.Data.elements.user && socketIo.Data.elements.user[0] && !this.forcePositionActive)
          return socketIo.Data.elements.user[0].x;
        return this.forcePosition.x;
      },
      y: function () {
        if (socketIo.Data.elements.user && socketIo.Data.elements.user[0] && !this.forcePositionActive)
          return socketIo.Data.elements.user[0].y;
        return this.forcePosition.y;
      },
      grids: ['grid-container', 'grid-container-paint'],
    },
    updateUserTestCell: function (x, y, width) {
      s(`.grid-container-position-test`).style.left = `${x * width}px`;
      s(`.grid-container-position-test`).style.top = `${y * width}px`;
      s(`.grid-container-position-test`).style.width = `${width}px`;
      s(`.grid-container-position-test`).style.height = `${width}px`;
    },
    init: function () {
      append(
        'grid',
        html`
          <style>
            .grid-cell-paint {
              box-sizing: border-box;
              border: 1px solid yellow;
            }
            .grid-cell {
              box-sizing: border-box;
              border: 1px solid black;
            }
            .grid-cell-center-icon {
              width: 20px;
              height: 20px;
              border: 2px solid blue;
            }
            .grid-container-position-test {
              box-sizing: border-box;
              border: 2px solid green;
            }
          </style>

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
                      .map((x) => html`<div class="in fll grid-cell grid-cell-${x}-${y}"></div>`)
                      .join('')}
                  </div>`
              )
              .join('')}
            <div class="abs grid-container-position-test"></div>
          </div>
        `
      );

      append('body', html` <div class="fix center grid-cell-center-icon"></div> `);
    },
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
        </style>
        <style class="css-controller-grid"></style>
        <grid class="abs"> </grid>
      `
    );
    this.appendGrids();
    index.ResponsiveController.Event['grid'] = () => {
      this.viewMatrixController();
    };
  },
  appendGrids: function () {
    pixi.appendInitHtml('grid');
    append('grid', html` <div class="abs grid-container-svg"></div> `);
    if (this.TestController.Data.active) this.TestController.init();
  },
  viewMatrixController: function () {
    const ResponsiveData = index.ResponsiveController.getResponsiveData();
    const ResponsiveDataAmplitude = index.ResponsiveController.getResponsiveDataAmplitude();

    const x = this.TestController.Data.x();
    const y = this.TestController.Data.y();
    if (this.TestController.Data.active)
      this.TestController.updateUserTestCell(x, y, ResponsiveDataAmplitude.minValue / matrixCells);

    if (ResponsiveData.minType === 'height') {
      this.Data.grids.concat(this.TestController.Data.active ? this.TestController.Data.grids : []).map((gridId) => {
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
      this.Data.grids.concat(this.TestController.Data.active ? this.TestController.Data.grids : []).map((gridId) => {
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
          .concat(this.TestController.Data.active ? this.TestController.Data.grids : [])
          .map(
            (gridId) => css`
              .${gridId} {
                width: ${ResponsiveDataAmplitude.minValue}px;
                height: ${ResponsiveDataAmplitude.minValue}px;
              }
            `
          )
          .join('')}

        ${this.TestController.Data.active
          ? css`
              .grid-cell {
                width: ${ResponsiveDataAmplitude.minValue / matrixCells}px;
                height: ${ResponsiveDataAmplitude.minValue / matrixCells}px;
              }
              .grid-cell-paint {
                width: ${ResponsiveDataAmplitude.minValue / (matrixCells * matrixCellsPaintByCell)}px;
                height: ${ResponsiveDataAmplitude.minValue / (matrixCells * matrixCellsPaintByCell)}px;
              }
            `
          : ''}
      `
    );
  },
};

grid.init();
