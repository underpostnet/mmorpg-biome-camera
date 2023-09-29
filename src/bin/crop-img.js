import sharp from 'sharp';
import { range } from '../server/common.js';

const dimW = 16;
const dimH = 23;
const valW = 512;
const valH = 867;
const cellW = valW / dimW;

// https://itch.io/game-assets/free/genre-rpg/tag-icons

const name = 'icon';
const originalImage = './src/bin/assets/icons.png';
for (const y of range(0, dimH - 1)) {
  for (const x of range(0, dimW - 1)) {
    await new Promise((resolve) => {
      const outputImage = `./src/client/public/icons/${name}-${x}-${y}.png`;
      sharp(originalImage)
        .extract({ width: cellW, height: cellW, left: x * cellW, top: y * cellW })
        .toFile(outputImage)
        .then(function (fileInfo) {
          console.log('Image cropped and saved: ', outputImage, fileInfo);
          resolve();
        })
        .catch(function (err) {
          console.log('An error occured: ', outputImage, err);
          resolve();
        });
    });
  }
}
