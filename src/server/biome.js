import { JSONweb } from './formatted.js';
import fs from 'fs';

// city map99d4-96x3
// fores map9e65-96x3
const biomeID = 'map99d4-96x3';

const biomeSSR = `
    const biomeID = ${JSONweb(biomeID)};
    const biomeMatrixSolid = ${JSONweb(
      JSON.parse(fs.readFileSync(`./src/client/public/biomes/${biomeID}/${biomeID}.solid.json`, 'utf8'))
    )};
    const biomeMatrixColor = ${JSONweb(
      JSON.parse(fs.readFileSync(`./src/client/public/biomes/${biomeID}/${biomeID}.color.json`, 'utf8'))
    )};
`;

export { biomeSSR, biomeID };
