import { JSONweb } from './formatted.js';
import fs from 'fs';

const biomeID = 'mapde08-16x3';

const biomeSSR = `
    const biomeID = ${JSONweb(biomeID)};
    const biomeMatrix = ${JSONweb(
      JSON.parse(fs.readFileSync(`./src/client/public/biomes/${biomeID}/${biomeID}.solid.json`, 'utf8'))
    )};
`;

export { biomeSSR, biomeID };
