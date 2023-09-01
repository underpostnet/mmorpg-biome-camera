import fs from 'fs';
import express from 'express';

import { copyDir, deleteFolderRecursive } from './files.js';
import { commonFunctions } from './common.js';
import { srcFormatted, pathViewFormatted } from './formatted.js';

import { ioSSR } from './socket.io.js';
import { mimeSSR } from './mimes.js';
import { biomeSSR } from './biome.js';

// view
import { IndexView } from '../client/views/index.js';

const views = async (app) => {
  const publicDirectory = './public';

  if (fs.existsSync(publicDirectory)) deleteFolderRecursive(`${publicDirectory}`);
  fs.mkdirSync(`${publicDirectory}`);

  await copyDir('./src/client/public', publicDirectory);

  let viewRender;
  eval(srcFormatted(fs.readFileSync('./src/client/ssr/view-render.js', 'utf8'), 'utf8'));

  [IndexView].map((view) => {
    console.log(view);
    const jsDists = [];
    view.node_modules.map((node_module) => {
      const dist = `/dist/${node_module.split('/').pop()}`;
      jsDists.push(dist);
      fs.copyFileSync(node_module, `${publicDirectory}${dist}`);
    });
    const appSrc = srcFormatted(
      `(function(){${
        commonFunctions +
        mimeSSR +
        ioSSR +
        biomeSSR +
        view.libs.map((lib) => fs.readFileSync(`./src/client/libs/${lib}.js`, 'utf8')).join('') +
        view.services
          .map((service) => fs.readFileSync(`./src/client/services/${service}.service.js`, 'utf8'))
          .join('') +
        view.componets.map((component) => fs.readFileSync(`./src/client/components/${component}.js`, 'utf8')).join('')
      }}())`
    );
    if (!fs.existsSync(`${publicDirectory}${pathViewFormatted(view.path)}`))
      fs.mkdirSync(`${publicDirectory}${pathViewFormatted(view.path)}`, { recursive: true });
    fs.writeFileSync(`${publicDirectory}${pathViewFormatted(view.path)}app.js`, appSrc, 'utf8');
    fs.writeFileSync(
      `${publicDirectory}${pathViewFormatted(view.path)}index.html`,
      viewRender({ title: view.title, jsDists }),
      'utf8'
    );
  });

  app.use('/', express.static(publicDirectory));
};

export { views };
