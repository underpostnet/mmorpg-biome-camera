const grid = {
  Data: {
    grids: ['grid-container-canvas'],
  },
  TestController: {
    Data: {
      active: true,
      forcePositionActive: false,
      forcePosition: {
        x: 0,
        y: 0,
      },
      x: function () {
        if (elements.user[0] && !this.forcePositionActive) return elements.user[0].x;
        return this.forcePosition.x;
      },
      y: function () {
        if (elements.user[0] && !this.forcePositionActive) return elements.user[0].y;
        return this.forcePosition.y;
      },
      grids: ['grid-container', 'grid-container-paint'],
      UserTestCell: {},
    },
    updateUserTestCell: function () {
      if (this.Data.UserTestCell.x !== undefined && this.Data.UserTestCell.y !== undefined)
        s(`.grid-cell-${this.Data.UserTestCell.x}-${this.Data.UserTestCell.y}`).style.border = null;

      if (this.Data.active && s(`.grid-cell-${this.Data.x()}-${this.Data.y()}`)) {
        s(`.grid-cell-${this.Data.x()}-${this.Data.y()}`).style.border = `2px solid green`;
        this.Data.UserTestCell.x = this.Data.x();
        this.Data.UserTestCell.y = this.Data.y();
      }
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
    pixi.appendInitHtml('grid');
    if (this.TestController.Data.active) this.TestController.init();
    index.ResponsiveController.Event['grid'] = () => {
      this.viewMatrixController();
    };
  },
  viewMatrixController: function () {
    const ResponsiveData = index.ResponsiveController.getResponsiveData();
    const ResponsiveDataAmplitude = index.ResponsiveController.getResponsiveDataAmplitude();

    const x = this.TestController.Data.x();
    const y = this.TestController.Data.y();
    this.TestController.updateUserTestCell();

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
