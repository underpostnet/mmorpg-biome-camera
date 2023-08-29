const biome = {
  init: function () {
    append(
      'menu',
      html`
        <button class="in generate-biome">generate biome</button>
        <button class="in download-biome-svg">download biome svg</button>
      `
    );
    s(`.generate-biome`).onclick = () => {
      const ResponsiveDataAmplitude = index.ResponsiveController.getResponsiveDataAmplitude();
      const matrixCellsPaint = matrixCells * matrixCellsPaintByCell;

      const svgRender = html` <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="${ResponsiveDataAmplitude.minValue}"
        height="${ResponsiveDataAmplitude.minValue}"
      >
        ${range(0, matrixCellsPaint - 1)
          .map((y) =>
            range(0, matrixCellsPaint - 1)
              .map((x) => {
                const recDim = ResponsiveDataAmplitude.minValue / matrixCellsPaint;
                const fill = random(0, 1) === 0 ? colors['red'] : colors['blue'];
                return html`
                  <rect
                    width="${recDim}"
                    height="${recDim}"
                    x="${x * recDim}"
                    y="${y * recDim}"
                    style="fill: ${fill}"
                  />
                `;
              })
              .join('')
          )
          .join('')}
      </svg>`;

      htmls('.grid-container-svg', svgRender);
      s('.download-biome-svg').onclick = () => downloader('map.svg', mimes['svg'], svgRender);
    };
  },
};

biome.init();
