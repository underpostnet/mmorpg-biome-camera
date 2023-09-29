import { JSONweb } from './formatted.js';
import fs from 'fs';
import { random, range } from './common.js';
import dotenv from 'dotenv';

dotenv.config();

const biomes = {
  forest: {
    biomeID: 'forest-2dae-16x3',
    matrixCells: 16 * 1,
    matrixCellsPaintByCell: 3,
    matrixCellsAmplitude: 1,
    biomeTotalBots: 1,
  },
  city: {
    biomeID: 'city-99d4-96x3',
    matrixCells: 16 * 6,
    matrixCellsPaintByCell: 3,
    matrixCellsAmplitude: 6,
    biomeTotalBots: 30,
  },
};

const { biomeID, matrixCells, matrixCellsPaintByCell, matrixCellsAmplitude, biomeTotalBots } =
  biomes[process.env.BIOME];

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
  biomeTotalBots,
  matrixCells,
  matrixCellsAmplitude,
  matrixCellsPaintByCell,
  validateBiomeCollision,
  setRandomAvailablePoint,
};
