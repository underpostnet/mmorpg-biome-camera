import { JSONweb } from './formatted.js';
import fs from 'fs';
import { random, range } from './common.js';

// city-99d4-96x3
// forest-9e65-96x3
// const biomeID = 'forest-2dae-16x3';
const biomeID = 'city-99d4-96x3';
const matrixCells = 16 * 6;
const matrixCellsPaintByCell = 3;
const matrixCellsAmplitude = 6;

// const matrixCells = 16;
// const matrixCellsPaintByCell = 3;
// const matrixCellsAmplitude = 2;

const biomeMatrixSolid = JSON.parse(
  fs.readFileSync(`./src/client/public/biomes/${biomeID.split('-')[0]}/${biomeID}/${biomeID}.solid.json`, 'utf8')
);
const biomeMatrixColor = JSON.parse(
  fs.readFileSync(`./src/client/public/biomes/${biomeID.split('-')[0]}/${biomeID}/${biomeID}.color.json`, 'utf8')
);

const validateBiomeCollision = (element) => {
  for (const sumY of range(0, matrixCellsPaintByCell * element.dimFactor - 1)) {
    for (const sumX of range(0, matrixCellsPaintByCell * element.dimFactor - 1)) {
      if (
        !biomeMatrixSolid[parseInt(element.y * matrixCellsPaintByCell + sumY)] ||
        biomeMatrixSolid[parseInt(element.y * matrixCellsPaintByCell + sumY)][
          parseInt(element.x * matrixCellsPaintByCell + sumX)
        ] === 1
      )
        return true;
    }
  }
  return false;
};

const setRandomAvailablePoint = (element, limitOptions) => {
  let attemps = 0;
  while ((attemps === 0 || validateBiomeCollision(element)) && attemps < matrixCells * matrixCells) {
    element.x =
      limitOptions === undefined
        ? random(0, matrixCells - element.dimFactor)
        : random(
            limitOptions.originX - limitOptions.rangePositionSearch,
            limitOptions.originX + limitOptions.rangePositionSearch
          );
    element.y =
      limitOptions === undefined
        ? random(0, matrixCells - element.dimFactor)
        : random(
            limitOptions.originY - limitOptions.rangePositionSearch,
            limitOptions.originY + limitOptions.rangePositionSearch
          );
    attemps++;
  }
  return element;
};

const biomeClientSRC = `
    const matrixCells = ${matrixCells};
    const matrixCellsAmplitude = ${matrixCellsAmplitude};
    const matrixCellsPaintByCell = ${matrixCellsPaintByCell};
    let biomeID = ${JSONweb(biomeID)};
    let biomeMatrixSolid = ${JSONweb(biomeMatrixSolid)};
    let biomeMatrixColor = ${JSONweb(biomeMatrixColor)};
    const validateBiomeCollision = ${validateBiomeCollision};
    const setRandomAvailablePoint = ${setRandomAvailablePoint};
`;

export {
  biomeClientSRC,
  biomeID,
  biomeMatrixSolid,
  biomeMatrixColor,
  matrixCells,
  matrixCellsAmplitude,
  matrixCellsPaintByCell,
  validateBiomeCollision,
  setRandomAvailablePoint,
};
