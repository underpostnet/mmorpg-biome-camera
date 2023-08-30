import { biome } from './biome.controller.js';

const biomeRouter = (app) => {
  app.post(`/biome`, biome);
};

export { biomeRouter };
