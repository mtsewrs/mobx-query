# Mobx Query

**DO NOT USE**

Generates typescript mst or mobx models and a react client to query your json rpc api

> In order for your models to work your database must return a "typename" property

## Installation

for mobx-state-tree

```bash
yarn add mobx-query mobx mobx-react mobx-state-tree react react-dom
```

for mobx only

```bash
yarn add mobx-query mobx mobx-react react react-dom
```

## Config

mobx-query requires a cosmiconfig file see https://github.com/davidtheclark/cosmiconfig

The options are as in typescript types below, example file in tests/mobx-query.config.js

```ts
type Types =
  | 'int'
  | 'string'
  | 'id'
  | 'boolean'
  | 'ref'
  | 'typename'
  | 'ref[]'
  | 'int[]'
  | 'string[]'
  | 'date'
  | 'json'

interface Models {
  [key: string]: {
    [key: string]: [Types, string?]
  }
}

interface Actions {
  [key: string]: {
    [key: string]: {
      returnType: string
      type: 'query' | 'mutation'
      args: {
        [key: string]: {
          type: string
          required: boolean
        }
      }
    }
  }
}

export interface Options {
  out?: string
  force?: boolean
  actions?: Actions
  models: Models
}
```

## Scaffold

```
yarn mobx-query scaffold --out src/models
```

## Usage

For now see react test in test folder for usage, examples will come soon
