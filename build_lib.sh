#!/bin/bash

yarn tsup --external react-dom/server --env.NODE_ENV production --minify lib/mobx/index.ts lib/mst/index.ts
yarn tsc -p ./mobx.tsconfig.json
yarn tsc -p ./mst.tsconfig.json
yarn tsc -p .
if [ -e ./src/templates ]; then cp -a ./src/templates ./build/templates; fi
echo "module.exports = require('./dist/mobx')" > mobx.js
echo "export * from './dist/mobx'" > mobx.d.ts
echo "module.exports = require('./dist/mst')" > mst.js
echo "export * from './dist/mst'" > mst.d.ts