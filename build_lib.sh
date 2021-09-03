#!/bin/bash
rm -rf dist
rm -rf build
yarn rollup -c
yarn tsc -p .
if [ -e ./cli/templates ]; then cp -a ./cli/templates ./build/templates; fi
echo "module.exports = require('./dist')" > mobx.js
echo "export * from './dist'" > mobx.d.ts