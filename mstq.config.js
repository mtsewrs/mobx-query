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
      password: ['string']
    }
  },
  actions: {
    article: {
      getarticle: {
        type: 'query'
      },
      getarticles: {
        type: 'query'
      },
      updatearticle: {
        type: 'query'
      }
    },
    store: {
      getStore: {
        type: 'query'
      },
      getStores: {
        type: 'query'
      },
      updateStore: {
        type: 'query'
      }
    },
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
          },
          username: {
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
