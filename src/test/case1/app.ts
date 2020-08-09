import { json, urlencoded } from 'body-parser';
import { BaseRouter } from './routes/baseRouter';

let exp = require('polka');
let hotReload = null;
if (process.env.NODE_ENV !== 'prod') {
  exp = require('express');
  const m = require('../../index');
  hotReload = m.hotReload;
}

const app = exp();

// set body max size
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '50mb', extended: true }));

const routePaths = [
  '/routes/router02'
];

const hotReloadMiddle = hotReload(`${__dirname}`, true);

for (const item of routePaths) {
  const routePath = `${__dirname}${item}`;
  if (hotReload) {
    app.use(hotReloadMiddle(routePath));
  } else {
    const type = require(routePath);
    const t: BaseRouter = new type(app);
    t.init();
  }
}

const server = app.listen(3000, ()=>{
  console.log('Listening on 3000');
});

export = server;