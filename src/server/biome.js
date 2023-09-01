import { JSONweb } from './formatted.js';
import fs from 'fs';
import { random, range } from './common.js';

// city map99d4-96x3
// fores map9e65-96x3
const biomeID = 'map99d4-96x3';
const matrixCells = 16 * 6;
const matrixCellsPaintByCell = 3;
const matrixCellsAmplitude = 6;

// const matrixCells = 16;
// const matrixCellsPaintByCell = 3;
// const matrixCellsAmplitude = 2;

const biomeMatrixSolid = JSON.parse(
  fs.readFileSync(`./src/client/public/biomes/${biomeID}/${biomeID}.solid.json`, 'utf8')
);
const biomeMatrixColor = JSON.parse(
  fs.readFileSync(`./src/client/public/biomes/${biomeID}/${biomeID}.color.json`, 'utf8')
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

const setRandomAvailablePoint = (element) => {
  let attemps = 0;
  while ((attemps === 0 || validateBiomeCollision(element)) && attemps < matrixCells * matrixCells) {
    element.x = random(0, matrixCells - element.dimFactor);
    element.y = random(0, matrixCells - element.dimFactor);
    attemps++;
  }
  return element;
};

const biomeSSR = `
    const matrixCells = ${matrixCells};
    const matrixCellsAmplitude = ${matrixCellsAmplitude};
    const matrixCellsPaintByCell = ${matrixCellsPaintByCell};
    const biomeID = ${JSONweb(biomeID)};
    const biomeMatrixSolid = ${JSONweb(biomeMatrixSolid)};
    const biomeMatrixColor = ${JSONweb(biomeMatrixColor)};
    const validateBiomeCollision = ${validateBiomeCollision};
    const setRandomAvailablePoint = ${setRandomAvailablePoint};
`;

export {
  biomeSSR,
  biomeID,
  biomeMatrixSolid,
  biomeMatrixColor,
  matrixCells,
  matrixCellsAmplitude,
  matrixCellsPaintByCell,
  validateBiomeCollision,
  setRandomAvailablePoint,
};
