#!/bin/bash
rm -rf dist
rm -rf build
yarn rollup -c
yarn tsc -p .
if [ -e ./src/templates ]; then cp -a ./src/templates ./build/templates; fi
echo "module.exports = require('./dist')" > mobx.js
echo "export * from './dist'" > mobx.d.ts