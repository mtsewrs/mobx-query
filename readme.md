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

The options are as in typescript types below

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
  [ModelName: string]: {
    [property: string]: [Types, string?]
  }
}

interface Actions {
  [path: string]: {
    [action: string]: {
      /*
        Typescript return type like '{ users: UserType[] }'.
        Models will have "Type" prefix so you can refer to them for example
        model name "User" exports type "UserType"
      */
      returnType: string
      type: 'query' | 'mutation'
      args: {
        [arg: string]: {
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

Example config

```js
module.exports = {
  models: {
    User: {
      typename: ['string'], // important
      id: ['id'],
      created_at: ['string'],
      updated_at: ['date'],
      name: ['string'],
      email: ['string'],
      password: ['string'],
      books: ['ref[]', 'Book'],
      friend: ['ref', 'User'],
    },
    Book: {
      typename: ['string'], // important
      id: ['id'],
      title: ['string'],
      author: ['ref', 'User'],
      publisher: ['ref', 'Publisher'],
      tags: ['ref[]', 'BookTag'],
      metaArrayOfStrings: ['json'],
    },
  },
  actions: {
    user: {
      getUser: {
        args: {
          id: {
            type: 'string',
          },
        },
        returnType: 'UserType',
        type: 'query',
      },
      getUsers: {
        returnType: '{ users: UserType[] }',
        type: 'query',
        path: 'user',
      },
      login: {
        args: {
          password: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
        },
        returnType: 'UserType',
        type: 'mutate',
      },
    },
  },
}
```

## Scaffold

```
yarn mobx-query scaffold --out src/models
```

## Usage

For now see react test in test folder for usage, examples will come soon
