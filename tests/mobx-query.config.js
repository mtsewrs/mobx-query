module.exports = {
  force: true,
  models: {
    User: {
      typename: ['string'],
      id: ['id'],
      created_at: ['string'],
      updated_at: ['date'],
      name: ['string'],
      email: ['string'],
      password: ['string'],
      books: ['ref[]', 'Book'],
      friend: ['ref', 'User'],
      favouriteBook: ['ref', 'Book']
    },
    Book: {
      typename: ['string'],
      id: ['id'],
      title: ['string'],
      author: ['ref', 'User'],
      publisher: ['ref', 'Publisher'],
      tags: ['ref[]', 'BookTag'],
      metaArrayOfStrings: ['json']
    },
    BookTag: {
      typename: ['string'],
      id: ['id'],
      name: ['string'],
      books: ['ref[]', 'Book']
    },
    Publisher: {
      typename: ['string'],
      id: ['id'],
      name: ['string'],
      books: ['ref[]', 'Book']
    }
  },
  actions: {
    user: {
      viewer: {
        returnType: 'UserType',
        type: 'query'
      },
      getUser: {
        args: {
          id: {
            type: 'string'
          }
        },
        returnType: 'UserType',
        type: 'query'
      },
      getUsers: {
        returnType: '{ users: UserType[] }',
        type: 'query',
        path: 'user'
      },
      createUser: {
        args: {
          password: {
            type: 'string'
          },
          email: {
            type: 'string'
          }
        },
        returnType: 'UserType',
        type: 'mutate'
      },
      login: {
        args: {
          password: {
            type: 'string'
          },
          email: {
            type: 'string'
          }
        },
        returnType: 'UserType',
        type: 'mutate'
      }
    }
  }
}
