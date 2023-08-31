import { JSONweb } from './formatted.js';
import fs from 'fs';

const biomeID = 'map9e65-96x3';

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
