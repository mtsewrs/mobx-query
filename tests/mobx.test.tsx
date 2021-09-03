import { RootStore } from './models'

const mockCallbackSuccess = jest.fn().mockImplementation(() =>
  Promise.resolve({
    users: [
      {
        id: 'a',
        email: 'a@test.com',
        typename: 'User',
        password: 'asdasd',
      },
      {
        id: 'b',
        email: 'b@test.com',
        typename: 'User',
        password: 'asdasd',
        friend: {
          id: 'a',
          email: 'a@test.com',
          typename: 'User',
          password: 'asdasd',
        },
        books: [
          {
            id: 'a',
            typename: 'Book',
          },
        ],
      },
    ],
  })
)

const errorMessage = 'Request failed with status code 400'
const mockCallbackError = jest.fn().mockRejectedValue(new Error(errorMessage))

describe('mobx store', () => {
  test('result should be undefined if error occurs', async () => {
    const store = new RootStore({
      request: mockCallbackError,
    })
    const response = await store.query('user', 'getUsers', {})
    expect(response).toBeUndefined()
  })

  test('it should be able to instantiate store and load initial data', async () => {
    const users = {
      a: {
        id: 'a',
        typename: 'User',
        email: 'a@test.com',
      },
    }

    const store = new RootStore(
      { request: mockCallbackSuccess },
      {
        users,
      }
    )

    const query = store.query('user', 'getUsers', {})
    expect(store.__promises.size).toBe(1)
    expect(store.users.size).toBe(1)
    const userA = store.users.get('a')
    expect(userA.email).toBe('a@test.com')
    await query.promise
    expect(store.__promises.size).toBe(0)
    expect(store.users.size).toBe(2)
    expect(userA.password).toBe('asdasd')
    const userB = store.users.get('b')
    expect(userB.friend.id).toBe('a')
    expect(userB.books.map((b) => b.id)).toEqual(['a'])
    expect(userB.email).toBe('b@test.com')
  })

  test('hydrate and rehydrate', async () => {
    const users = {
      a: {
        id: 'a',
        typename: 'User',
        email: 'a@test.com',
      },
    }

    const store = new RootStore(
      { request: mockCallbackSuccess },
      {
        users,
      }
    )

    const snapshot = store.getSnapshot()

    expect(snapshot.users['a'].id).toBe(users['a'].id)

    await store.query('user', 'getUsers')

    const store2 = new RootStore(
      { request: mockCallbackSuccess },
      JSON.parse(JSON.stringify(snapshot))
    )

    expect(store2.__queryCacheData.size).toBe(1)
    expect(store2.users.size).toBe(1)
    const data = await store2.query('user', 'getUsers', {})
    expect(data.users[0].update).toBeDefined()
  })

  test("it should preload and push pending queries to '__promises'", async () => {
    const store = new RootStore(
      {
        request: mockCallbackSuccess,
        ssr: true,
      },
      {
        users: {
          a: {
            id: 'a',
            typename: 'User',
            email: 'a@test.com',
          },
        },
      }
    )

    store.query('user', 'getUsers', {})
    expect(store.__promises.size).toBe(1)
    expect(store.users.size).toBe(1)
    await Promise.all(store.__promises.values())
    expect(store.users.size).toBe(2)
    const user = store.users.get('b')
    expect(user.email).toBe('b@test.com')
    expect(user.friend.id).toBe('a')
  })

  test('it should return initial data', async () => {
    const store = new RootStore({
      request: mockCallbackSuccess,
    })
    const data = await store.query(
      'user',
      'getUsers',
      {},
      {
        initialData: {
          users: [{ id: 'a', typename: 'User', email: 'a@test.com' }],
        },
      }
    )
    expect(store.users.size).toBe(1)
    expect(data.users.length).toBe(1)
    const user = store.users.get('a')
    expect(user.email).toBe('a@test.com')
    expect(data.users[0].email).toBe('a@test.com')
  })
})
