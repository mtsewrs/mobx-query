import { system, filesystem } from 'gluegun'
import { RootStore } from './models/mst'

const src = filesystem.path(__dirname, '..')
const schemaSrc = filesystem.path(__dirname)

const cli = async (cmd: string) =>
  system.run('node ' + filesystem.path(src, 'bin', 'cli') + ` ${cmd}`)

const mockCallbackSuccess = jest.fn().mockImplementation(() =>
  Promise.resolve([
    {
      id: 'a',
      email: 'a@test.com',
      typename: 'User',
      password: 'asdasd'
    },
    {
      id: 'b',
      email: 'b@test.com',
      typename: 'User',
      password: 'asdasd'
    }
  ])
)

const errorMessage = 'Request failed with status code 400'
const mockCallbackError = jest.fn().mockRejectedValue(new Error(errorMessage))

beforeAll(async () => {
  await cli(`scaffold --test --out ${filesystem.path(schemaSrc, 'models/mst')}`)
})

describe('mst models', () => {
  test('result should be undefined if error occurs', async () => {
    const store = RootStore.create(undefined, {
      request: mockCallbackError
    })
    const response = await store.queryGetUsers()
    expect(response).toBeUndefined()
  })

  test('it should be able to instantiate store and load initial data', async () => {
    /** Create a store with some initial state */
    const store = RootStore.create(
      {
        users: {
          a: {
            id: 'a',
            typename: 'User',
            email: 'a@test.com'
          }
        }
      } as any,
      {
        request: mockCallbackSuccess
      }
    )

    const query = store.queryGetUsers()
    expect(store.__promises.size).toBe(1)
    expect(store.users.size).toBe(1)
    const userA = store.users.get('a')
    expect(userA.email).toBe('a@test.com')
    await query.promise
    expect(store.__promises.size).toBe(0)
    expect(store.users.size).toBe(2)
    expect(userA.password).toBe('asdasd')
    const userB = store.users.get('b')
    expect(userB.email).toBe('b@test.com')
  })

  test("it should preload and push pending queries to '__promises'", async () => {
    /** Create a store with some initial state */
    const store = RootStore.create(
      {
        users: {
          a: {
            id: 'a',
            typename: 'User',
            email: 'a@test.com'
          }
        }
      } as any,
      {
        request: mockCallbackSuccess,
        ssr: true
      }
    )

    store.queryGetUsers()
    expect(store.__promises.size).toBe(1)
    expect(store.users.size).toBe(1)
    await Promise.all(store.__promises.values())
    expect(store.users.size).toBe(2)
    const user = store.users.get('b')
    expect(user.email).toBe('b@test.com')
  })
})
