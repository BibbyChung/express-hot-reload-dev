# express-hot-reload-dev [![Build Status](https://travis-ci.org/BibbyChung/express-hot-reload-dev.svg?branch=master)](https://travis-ci.org/BibbyChung/express-hot-reload-dev) [![npm](https://img.shields.io/npm/v/express-hot-reload-dev.svg)](https://github.com/BibbyChung/express-hot-reload-dev)

hot reload for express

## how to use

[demo 0](https://github.com/BibbyChung/express-hot-reload-dev/tree/master/src/test/case0) |
[demo 1](https://github.com/BibbyChung/express-hot-reload-dev/tree/master/src/test/case1)

```js
import exp from 'express';
import { hotReload } from 'express-hot-reload-dev';

const app = exp();

const hotReloadMiddle = hotReload(`${__dirname}`, false);

const routePaths = [
  '/routes/router01'
];

for (const item of routePaths) {
  const routePath = `${__dirname}${item}`;
  app.use(hotReloadMiddle(routePath));
}

app.listen(3000, ()=>{
  console.log('Listening on 3000');
}); 
```

## workspace

```docker
docker run --rm -it \
  -w /app \
  -v $(pwd):/app \
  -p 9000:9000 \
  node:12.14-alpine /bin/sh
```

## run test

```bash
npm i
npm run test
```

## references

- https://github.com/kevinsimper/express-reload


## other issues

- https://zhuanlan.zhihu.com/p/34702356