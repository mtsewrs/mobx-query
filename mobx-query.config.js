module.exports = {
  force: true,
  out: 'tests/models',
  models: {
    User: {
      created_at: {
        type: 'string',
      },
      updated_at: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
      books: {
        type: 'ref[]',
        ref: 'Book',
      },
      friend: {
        type: 'ref',
        ref: 'User',
      },
      favouriteBook: {
        type: 'ref',
        ref: 'Book',
      },
    },
    Book: {
      title: {
        type: 'string',
      },
      author: {
        type: 'ref',
        ref: 'User',
      },
      publisher: {
        type: 'ref',
        ref: 'Publisher',
      },
      tags: {
        type: 'ref[]',
        ref: 'BookTag',
      },
      metaArrayOfStrings: {
        type: 'any',
      },
    },
    BookTag: {
      name: {
        type: 'string',
      },
      books: {
        type: 'ref[]',
        ref: 'Book',
      },
    },
    Publisher: {
      name: {
        type: 'string',
      },
      books: {
        type: 'ref[]',
        ref: 'Book',
      },
    },
  },
  actions: {
    user: {
      viewer: {
        type: 'UserType',
      },
      getUser: {
        args: {
          id: {
            type: 'string',
          },
        },
        type: 'UserType',
      },
      getUsers: {
        type: '{ users: UserType[] }',
      },
      createUser: {
        args: {
          password: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
        },
        type: 'UserType',
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
        type: 'UserType',
      },
    },
  },
}
