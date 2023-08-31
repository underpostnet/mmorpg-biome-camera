const biome = {
  init: function () {
    append(
      'menu',
      html`
        <button class="in generate-biome-forest">generate forest biome</button>
        <button class="in generate-biome-city">generate city biome</button>
        <button class="in download-biome-svg">download biome svg</button>
        <button class="in download-biome-solid-json">download biome solid json</button>
        <button class="in upload-biome">upload biome</button>
      `
    );
    s(`.generate-biome-city`).onclick = () => {
      const matrixCellsPaint = matrixCells * matrixCellsPaintByCell;

      const buildingStyles = [
        {
          name: 'blue',
          body: ['#000c2d', '#001a5e'],
          window: ['#ccce41', '#ffff4a', '#ffff99'],
        },
        {
          name: 'purple',
          body: ['#4f004f', '#620062'],
          window: ['#b83e0a', '#e44d0c', '#f47239'],
        },
      ];
      const pavementStyle = ['#373737', '#282828', '#1d1d1d', 'black'];
      const matrixColorBiome = {};
      const matrixSolidBiome = {};

      // biome seeds
      let colorCell;
      const matrixSeedColorBiome = {};
      range(0, matrixCellsPaint - 1).map((y) => {
        range(0, matrixCellsPaint - 1).map((x) => {
          if (x % matrixCellsPaintByCell === 0 && y % matrixCellsPaintByCell === 0 && random(0, 700) < 10) {
            colorCell = buildingStyles[random(0, buildingStyles.length - 1)].body[0];
          } else {
            const probPavement = random(0, 700);
            if (probPavement < 10) {
              colorCell = pavementStyle[pavementStyle.length - 1];
            } else if (probPavement < 100) {
              colorCell = pavementStyle[pavementStyle.length - 2];
            } else if (probPavement < 300) {
              colorCell = pavementStyle[pavementStyle.length - 3];
            } else {
              colorCell = pavementStyle[pavementStyle.length - 4];
            }
          }
          if (!matrixSeedColorBiome[y]) matrixSeedColorBiome[y] = {};
          matrixSeedColorBiome[y][x] = newInstance(colorCell);
        });
      });

      const baseCordValidator = (x, y, maxLimitX, maxLimitY) => x >= 0 && y >= 0 && x <= maxLimitX && y <= maxLimitY;

      const buildLimitStorage = {};
      Object.keys(matrixSeedColorBiome).map((y) => {
        Object.keys(matrixSeedColorBiome[y]).map((x) => {
          x = parseInt(x);
          y = parseInt(y);
          buildingStyles.map((buildStyle) => {
            // builging
            if (matrixSeedColorBiome[y][x] === buildStyle.body[0]) {
              // body
              const xFactor = random(4, 8);
              const yFactor = random(3, 10);
              const buildLimitX = matrixCellsPaintByCell * xFactor - 1;
              const buildLimitY = matrixCellsPaintByCell * yFactor - 1;

              if (!buildLimitStorage[x]) buildLimitStorage[x] = {};
              buildLimitStorage[x][y] = {
                buildLimitX,
                buildLimitY,
              };

              range(0, buildLimitX).map((sumX) =>
                range(0, buildLimitY).map((sumY) => {
                  if (baseCordValidator(x + sumX, y + sumY, matrixCellsPaint - 1, matrixCellsPaint - 1)) {
                    colorCell = buildStyle.body[random(0, 500) < 100 || x + sumX <= x + random(3, 7) ? 0 : 1];
                    if (!matrixSolidBiome[y + sumY]) matrixSolidBiome[y + sumY] = {};
                    matrixSolidBiome[y + sumY][x + sumX] = 1;
                    if (!matrixColorBiome[y + sumY]) matrixColorBiome[y + sumY] = {};
                    matrixColorBiome[y + sumY][x + sumX] = `${colorCell}`;
                  }
                })
              );
              // window
              range(0, buildLimitX).map((sumX) =>
                range(0, buildLimitY).map((sumY) => {
                  if (random(0, 1) === 0) return;
                  if (
                    baseCordValidator(x + sumX, y + sumY, matrixCellsPaint - 1, matrixCellsPaint - 1) &&
                    (x + sumX) % 4 === 0 &&
                    (y + sumY) % 4 === 0
                  ) {
                    // single window area
                    const xFactorWindow = random(1, 2);
                    const yFactorWindow = random(1, 2);
                    range(0, xFactorWindow).map((sumX0) =>
                      range(0, yFactorWindow).map((sumY0) => {
                        if (
                          baseCordValidator(x + sumX + sumX0, y + sumY + sumY0, x + buildLimitX, y + buildLimitY) &&
                          y + sumY + sumY0 < y + buildLimitY - 4 &&
                          y + sumY + sumY0 > y
                        ) {
                          colorCell = buildStyle.window[random(0, 2)];
                          if (!matrixColorBiome[y + sumY + sumY0]) matrixColorBiome[y + sumY + sumY0] = {};
                          matrixColorBiome[y + sumY + sumY0][x + sumX + sumX0] = `${colorCell}`;
                        }
                      })
                    );
                  }
                })
              );
            }
          });
        });
      });

      Object.keys(matrixSeedColorBiome).map((y) => {
        Object.keys(matrixSeedColorBiome[y]).map((x) => {
          x = parseInt(x);
          y = parseInt(y);
          buildingStyles.map((buildStyle) => {
            // builging
            if (matrixSeedColorBiome[y][x] === buildStyle.body[0]) {
              const { buildLimitX, buildLimitY } = buildLimitStorage[x][y];
              // door
              const dimDoor = 2;
              const xDoorPadding = 2;
              const xDoorCords = range(x + xDoorPadding, x + buildLimitX - xDoorPadding - dimDoor).filter(
                (n) => n % matrixCellsPaintByCell === 0
              );
              const xDoor = xDoorCords[random(0, xDoorCords.length - 1)];
              const yDoor = y + buildLimitY;
              let validDoor = true;
              // colorCell = 'red';
              range(0, dimDoor).map((deltaX) =>
                range(1, dimDoor + 1).map((deltaY) => {
                  if (
                    !baseCordValidator(xDoor + deltaX, yDoor + deltaY, matrixCellsPaint - 1, matrixCellsPaint - 1) ||
                    !baseCordValidator(xDoor + deltaX, yDoor + deltaY, x + buildLimitX, y + buildLimitY + dimDoor + 1)
                  ) {
                    validDoor = false;
                  }

                  if (
                    matrixColorBiome[yDoor + deltaY] &&
                    matrixColorBiome[yDoor + deltaY][xDoor + deltaX] &&
                    !pavementStyle.includes(matrixColorBiome[yDoor + deltaY][xDoor + deltaX])
                  ) {
                    validDoor = false;
                  } else if (
                    matrixSeedColorBiome[yDoor + deltaY] &&
                    matrixSeedColorBiome[yDoor + deltaY][xDoor + deltaX] &&
                    !pavementStyle.includes(matrixSeedColorBiome[yDoor + deltaY][xDoor + deltaX])
                  ) {
                    velidDoor = false;
                  }
                })
              );
              if (!validDoor) return;
              colorCell = 'black';
              range(0, dimDoor).map((deltaX) =>
                range(0, dimDoor).map((deltaY) => {
                  if (
                    baseCordValidator(xDoor + deltaX, yDoor - deltaY, matrixCellsPaint - 1, matrixCellsPaint - 1) &&
                    baseCordValidator(xDoor + deltaX, yDoor - deltaY, x + buildLimitX, y + buildLimitY)
                  ) {
                    if (!matrixColorBiome[yDoor - deltaY]) matrixColorBiome[yDoor - deltaY] = {};
                    matrixColorBiome[yDoor - deltaY][xDoor + deltaX] = `${colorCell}`;
                    if (!matrixSolidBiome[yDoor - deltaY]) matrixSolidBiome[yDoor - deltaY] = {};
                    matrixSolidBiome[yDoor - deltaY][xDoor + deltaX] = 0;
                  }
                })
              );
            }
          });
        });
      });

      this.renderSVG(matrixCellsPaint, matrixSeedColorBiome, matrixColorBiome, matrixSolidBiome);
    };
    s(`.generate-biome-forest`).onclick = () => {
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

      this.renderSVG(matrixCellsPaint, matrixSeedColorBiome, matrixColorBiome, matrixSolidBiome);
    };
  },
  renderSVG: function (matrixCellsPaint, matrixSeedColorBiome, matrixColorBiome, matrixSolidBiome) {
    const ResponsiveDataAmplitude = index.ResponsiveController.getResponsiveDataAmplitude();
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
              const fill =
                matrixColorBiome[y] && matrixColorBiome[y][x] ? matrixColorBiome[y][x] : matrixSeedColorBiome[y][x];
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

    console.log(JSONmatrix(solidMatrix));
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
  },
};

biome.init();
