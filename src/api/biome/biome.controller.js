import fs from 'fs';
import sharp from 'sharp';
import { copyDir } from '../../server/files.js';

const directory = `./src/client/public/biomes`;

const biome = async (req, res) => {
  try {
    if (!fs.existsSync(`${directory}/${req.body.id}`)) fs.mkdirSync(`${directory}/${req.body.id}`, { recursive: true });

    fs.writeFileSync(
      `${directory}/${req.body.id}/${req.body.id}.color.json`,
      JSON.stringify(req.body.color, null, 1),
      'utf8'
    );

    fs.writeFileSync(
      `${directory}/${req.body.id}/${req.body.id}.solid.json`,
      JSON.stringify(req.body.solid, null, 1),
      'utf8'
    );

    fs.writeFileSync(`${directory}/${req.body.id}/${req.body.id}.svg`, req.body.svg, 'utf8');

    await new Promise((resolve, reject) => {
      sharp(`${directory}/${req.body.id}/${req.body.id}.svg`)
        .png()
        .toFile(`${directory}/${req.body.id}/${req.body.id}.png`)
        .then((info) => resolve(info))
        .catch((err) => reject(err));
    });

    const publicDirectory = `./public/biomes`;

    fs.mkdirSync(`${publicDirectory}/${req.body.id}`, { recursive: true });

    await copyDir(`${directory}/${req.body.id}`, `${publicDirectory}/${req.body.id}`);

    return res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      data: {
        message: error.message,
      },
    });
  }
};

export { biome };
