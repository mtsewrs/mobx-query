# Mobx Query

**DO NOT USE, NOT STABLE**

Generates typescript mst or mobx models and a react client to query your json rpc api

> In order for your models to work your database must have a "typename" and "id" property

## Installation

```bash
yarn add mobx-query mobx mobx-react-lite react react-dom
```

## Config

mobx-query requires a cosmiconfig file see https://github.com/davidtheclark/cosmiconfig

Example config

```js
module.exports = {
  out: 'src/models', // defaults to src/models
  force: false, // defaults to false, will delete the whole models folder so be careful
  models: {
    User: {
      created_at: ['string'],
      updated_at: ['date'],
      name: ['string'],
      email: ['string'],
      password: ['string'],
      books: ['ref[]', 'Book'],
      friend: ['ref', 'User'],
    },
    Book: {
      title: ['string'],
      author: ['ref', 'User'],
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
