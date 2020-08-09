import { json, urlencoded } from 'body-parser';
import exp from 'express';
import { hotReload } from '../../index';

const app = exp();

// set body max size
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '50mb', extended: true }));

const routePaths = [
  '/routes/router01'
];

const hotReloadMiddle = hotReload(`${__dirname}`, true);

for (const item of routePaths) {
  const routePath = `${__dirname}${item}`;
  app.use(hotReloadMiddle(routePath));
}

const server = app.listen(3000, () => {
  console.log('Listening on 3000');
});

export = server;