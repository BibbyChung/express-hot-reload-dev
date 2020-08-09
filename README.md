# express-hot-reload
hot reload for express


## workspace

``` docker
docker run --rm -it \
  -w /app \
  -v $(pwd):/app \
  -p 9000:9000 \
  node:12.14-alpine /bin/sh
```

## run test in this project

``` bash
npm i
npm run test
```
