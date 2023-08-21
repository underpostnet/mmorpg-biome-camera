import fs from 'fs';
import express from 'express';

import { copyDir, deleteFolderRecursive } from '../../core/server/util/files.js';
import { commonFunctions } from '../../core/server/util/common.js';
import { srcFormatted, pathViewFormatted } from '../../core/server/util/formatted.js';

// view
import { IndexView } from '../client/views/index.js';

const views = async (app) => {
  const publicDirectory = './public';

  if (fs.existsSync(publicDirectory)) deleteFolderRecursive(`${publicDirectory}`);
  fs.mkdirSync(`${publicDirectory}`);

  await copyDir('./src/client/public', publicDirectory);

  const baseClientJS = `
    ${commonFunctions()}
    ${fs.readFileSync('./core/client/components/vanilla.js', 'utf8')}
    ${fs.readFileSync('./core/client/components/css.js', 'utf8')}
`;

  let viewRender;
  eval(srcFormatted(fs.readFileSync('./src/client/render.js', 'utf8'), 'utf8'));

  [IndexView].map((view) => {
    console.log('render', view);
    const appSrc = srcFormatted(`
       ${baseClientJS}
      ${view.componets.map((component) => fs.readFileSync(`./src/client/components/${component}.js`, 'utf8')).join('')}
    `);
    if (!fs.existsSync(`${publicDirectory}${pathViewFormatted(view.path)}`))
      fs.mkdirSync(`${publicDirectory}${pathViewFormatted(view.path)}`, { recursive: true });
    fs.writeFileSync(`${publicDirectory}${pathViewFormatted(view.path)}app.js`, appSrc, 'utf8');
    fs.writeFileSync(
      `${publicDirectory}${pathViewFormatted(view.path)}index.html`,
      viewRender({ title: view.title }),
      'utf8'
    );
  });

  app.use('/', express.static(publicDirectory));
};

export { views };
