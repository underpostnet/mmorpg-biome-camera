const grid = {
  init: function () {
    append(
      'body',
      html`
        <style>
          .grid-cell {
            box-sizing: border-box;
            border: 1px solid yellow;
          }
        </style>
        <style class="css-controller-grid"></style>
        <div class="abs grid-container">
          ${range(0, matrixCells - 1)
            .map(
              (y) =>
                html`<div class="fl">
                  ${range(0, matrixCells - 1)
                    .map((x) => html`<div class="in fll grid-cell"></div>`)
                    .join('')}
                </div>`
            )
            .join('')}
        </div>
      `
    );

    index.ResponsiveController.Event['grid'] = () => {
      const ResponsiveData = index.ResponsiveController.Data.Responsive;
      htmls(
        '.css-controller-grid',
        css`
          .grid-container {
            width: ${ResponsiveData.minValue}px;
            height: ${ResponsiveData.minValue}px;
          }
          .grid-cell {
            width: ${ResponsiveData.minValue / matrixCells}px;
            height: ${ResponsiveData.minValue / matrixCells}px;
          }
          ${ResponsiveData.minType === 'height'
            ? css`
                .grid-container {
                  top: 0px;
                  left: ${ResponsiveData.maxValue / 2 - ResponsiveData.minValue / 2}px;
                }
              `
            : css`
                .grid-container {
                  top: ${ResponsiveData.maxValue / 2 - ResponsiveData.minValue / 2}px;
                  left: 0px;
                }
              `}
        `
      );
    };
  },
};

grid.init();
