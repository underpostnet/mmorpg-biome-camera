const biome = {
  init: function () {
    append(
      'menu',
      html`
        <button class="in generate-biome">generate biome</button>
        <button class="in download-biome-svg">download biome svg</button>
        <button class="in download-biome-solid-json">download biome solid json</button>
        <button class="in upload-biome">upload biome</button>
      `
    );
    s(`.generate-biome`).onclick = () => {
      const ResponsiveDataAmplitude = index.ResponsiveController.getResponsiveDataAmplitude();
      const matrixCellsPaint = matrixCells * matrixCellsPaintByCell;

      // phenotypes
      const treePhenotype = [
        ['#c41919', '#810202'],
        ['#aaf93e', '#e7ef46'],
      ];

      const validateMatrixLimit = (x, y) => x >= 0 && y >= 0 && x <= matrixCellsPaint - 1 && y <= matrixCellsPaint - 1;

      const matrixColorBiome = {};
      const matrixSolidBiome = {};

      // biome seeds
      const matrixSeedColorBiome = {};

      range(0, matrixCellsPaint - 1).map((y) => {
        range(0, matrixCellsPaint - 1).map((x) => {
          const probColor = random(0, 700);

          let colorCell;
          if (probColor <= 3) {
            colorCell = '#AF5E06';
          } else if (probColor <= 22) {
            colorCell = '#29714c';
          } else if (probColor <= 30) {
            colorCell = treePhenotype[random(0, treePhenotype.length - 1)][0];
          } else {
            colorCell = '#3bb177';
          }

          if (!matrixSeedColorBiome[y]) {
            matrixSeedColorBiome[y] = {};
            matrixColorBiome[y] = {};
          }
          matrixSeedColorBiome[y][x] = colorCell;
        });
      });

      // dark lawn
      (() => {
        let colorCell = '#29714c';
        Object.keys(matrixSeedColorBiome).map((y) => {
          Object.keys(matrixSeedColorBiome[y]).map((x) => {
            x = parseInt(x);
            y = parseInt(y);
            if (matrixSeedColorBiome[y][x] === colorCell) {
              range(-3, 3).map((sumX) =>
                range(-1, 1).map((sumY) => {
                  if (random(0, 8) > 2) return;
                  if (validateMatrixLimit(x + sumX, y + sumY)) matrixColorBiome[y + sumY][x + sumX] = `${colorCell}`;
                })
              );
              colorCell = '#349a67';
              range(-5, 5).map((sumX) =>
                range(-3, 3).map((sumY) => {
                  if (random(0, 10) > 2) return;
                  if (validateMatrixLimit(x + sumX, y + sumY)) matrixColorBiome[y + sumY][x + sumX] = `${colorCell}`;
                })
              );
              colorCell = '#29714c';
            }
          });
        });
      })();

      // flowers
      (() => {
        Object.keys(matrixSeedColorBiome).map((y) => {
          Object.keys(matrixSeedColorBiome[y]).map((x) => {
            x = parseInt(x);
            y = parseInt(y);
            treePhenotype.map((phenoType) => {
              if (matrixSeedColorBiome[y][x] === phenoType[0]) {
                range(-2, 2).map((sumX) =>
                  range(1, 1).map((sumY) => {
                    if (random(0, 1) === 0) return;
                    if (validateMatrixLimit(x + sumX, y + sumY))
                      matrixColorBiome[y + sumY][x + sumX] = `${phenoType[random(0, phenoType.length - 1)]}`;
                  })
                );
              }
            });
          });
        });
      })();

      (() => {
        let colorCell = '#AF5E06';
        Object.keys(matrixSeedColorBiome).map((y) => {
          Object.keys(matrixSeedColorBiome[y]).map((x) => {
            x = parseInt(x);
            y = parseInt(y);
            if (matrixSeedColorBiome[y][x] === colorCell) {
              // shadow
              colorCell = '#29714c';
              range(-2, 2).map((sumX) =>
                range(4, 5).map((sumY) => {
                  // if (random(0, 1) === 0) return;
                  if (validateMatrixLimit(x + sumX, y + sumY)) matrixColorBiome[y + sumY][x + sumX] = `${colorCell}`;
                })
              );
              range(-3, 3).map((sumX) =>
                range(3, 6).map((sumY) => {
                  if (random(0, 1) === 0) return;
                  if (validateMatrixLimit(x + sumX, y + sumY)) matrixColorBiome[y + sumY][x + sumX] = `${colorCell}`;
                })
              );
              colorCell = '#349a67';
              range(-4, 4).map((sumX) =>
                range(2, 7).map((sumY) => {
                  if (random(0, 10) > 1) return;
                  if (validateMatrixLimit(x + sumX, y + sumY)) matrixColorBiome[y + sumY][x + sumX] = `${colorCell}`;
                })
              );
              // tree leaves
              const selectPhenotype = treePhenotype[random(0, treePhenotype.length - 1)];
              range(-4, 4).map((sumX) =>
                range(-6, -1).map((sumY) => {
                  if (random(1, 0) === 1 && (sumX > 3 || sumX < -3) && (sumY > -3 || sumY < -4)) return;
                  colorCell = selectPhenotype[0];
                  if (validateMatrixLimit(x + sumX, y + sumY)) {
                    matrixColorBiome[y + sumY][x + sumX] = `${colorCell}`;
                    if (!matrixSolidBiome[y + sumY]) matrixSolidBiome[y + sumY] = {};
                    matrixSolidBiome[y + sumY][x + sumX] = 1;
                  }
                })
              );
              range(-5, 5).map((sumX) =>
                range(-5, 0).map((sumY) => {
                  if (random(1, 4) === 4) return;
                  colorCell = selectPhenotype[1];
                  if (validateMatrixLimit(x + sumX, y + sumY)) matrixColorBiome[y + sumY][x + sumX] = `${colorCell}`;
                })
              );
              // rhizome
              colorCell = '#AF5E06';
              range(0, 0).map((sumX) =>
                range(-1, 3).map((sumY) => {
                  if (random(0, 1) === 0) colorCell = '#975206';
                  if (validateMatrixLimit(x + sumX, y + sumY)) {
                    matrixColorBiome[y + sumY][x + sumX] = `${colorCell}`;
                    if (!matrixSolidBiome[y + sumY]) matrixSolidBiome[y + sumY] = {};
                    matrixSolidBiome[y + sumY][x + sumX] = 1;
                  }

                  colorCell = '#AF5E06';
                })
              );
              // roots
              [-1, 1].map((sumX) =>
                range(-1, 3).map((sumY) => {
                  if (random(0, 1) === 0) return;
                  if (random(0, 1) === 0) colorCell = '#975206';
                  if (validateMatrixLimit(x + sumX, y + sumY)) matrixColorBiome[y + sumY][x + sumX] = `${colorCell}`;

                  colorCell = '#AF5E06';
                })
              );
            }
          });
        });
      })();

      const solidMatrix = [];
      const colorMatrix = [];
      const svgRender = html` <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="${ResponsiveDataAmplitude.minValue}"
        height="${ResponsiveDataAmplitude.minValue}"
      >
        ${range(0, matrixCellsPaint - 1)
          .map((y) => {
            solidMatrix[y] = [];
            colorMatrix[y] = [];
            return range(0, matrixCellsPaint - 1)
              .map((x) => {
                if (matrixSolidBiome[y] && matrixSolidBiome[y][x]) solidMatrix[y].push(1);
                else solidMatrix[y].push(0);

                const recDim = ResponsiveDataAmplitude.minValue / matrixCellsPaint;
                // const fill = random(0, 1) === 0 ? colors['red'] : colors['blue'];
                const fill = matrixColorBiome[y][x] ? matrixColorBiome[y][x] : matrixSeedColorBiome[y][x];
                colorMatrix[y][x] = `${fill}`;
                return html`
                  <rect
                    width="${recDim}"
                    height="${recDim}"
                    x="${x * recDim}"
                    y="${y * recDim}"
                    stroke="${fill}"
                    stroke-width="2"
                    stroke-linecap="square"
                    style="fill: ${fill}"
                  />
                `;
              })
              .join('');
          })
          .join('')}
      </svg>`;

      // console.log(JSONmatrix(solidMatrix));
      // console.log(JSONmatrix(colorMatrix));

      htmls('.grid-container-svg', svgRender);

      const idMap = `map${s4()}-${matrixCells}x${matrixCellsPaintByCell}`;

      s('.download-biome-svg').onclick = () => downloader(`${idMap}.svg`, mimes['svg'], svgRender);
      s('.download-biome-solid-json').onclick = () => downloader(`${idMap}.json`, mimes['json'], solidMatrix);
      s('.upload-biome').onclick = async () => {
        const body = {
          id: idMap,
          solid: solidMatrix,
          svg: svgRender,
          color: colorMatrix,
        };
        const result = await biomeService.biome(body);
      };
    };
  },
};

biome.init();
