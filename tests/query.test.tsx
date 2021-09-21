import * as React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import { observer } from 'mobx-react'
import { ErrorBoundary } from 'react-error-boundary'

import { RootStore, useQuery } from './models'

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
      },
    ],
  })
)

const mockCallbackSuccess2 = jest.fn().mockImplementationOnce(() =>
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
      },
    ],
  })
)

const mockCallbackSucces3 = jest.fn().mockImplementation(() =>
  Promise.resolve({
    user: {
      id: 'a',
      email: 'a@test.com',
      typename: 'User',
      password: 'asdasd',
    },
  })
)

describe('useQuery', () => {
  it('[mobx] error works', async () => {
    const errorMessage = 'Request failed with status code 400'
    const mockCallbackError = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage))
    const store = new RootStore({
      request: mockCallbackError,
    })

    function Page() {
      const { error, loading } = useQuery(
        (store) => store.query('user', 'getUsers'),
        {
          store,
        }
      )

      if (loading) {
        return <>loading...</>
      }

      return <>{error.message}</>
    }

    const MyPage = observer(Page)
    const rendered = render(<MyPage />)

    await waitFor(() => rendered.getByText('loading...'))
    await waitFor(() => rendered.getByText(errorMessage))

    expect(mockCallbackError).toHaveBeenCalledTimes(1)
  })

  it('[mobx] should return partial cache response', async () => {
    const store = new RootStore(
      {
        request: mockCallbackSucces3,
      },
      {
        users: {
          a: {
            id: 'a',
            typename: 'User',
          },
        },
      }
    )
    function Page() {
      const { data: user, query } = useQuery(
        (store) =>
          store.query('user', 'getUser', undefined, {
            fromCache: ['User', 'a'],
          }),
        {
          store,
        }
      )

      if (query.cache) {
        return <>{query.cache.id}</>
      }

      return <>{user.user.email}</>
    }
    const MyPage = observer(Page)
    const rendered = render(<MyPage />)
    await waitFor(() => rendered.getByText('a'))
    await waitFor(() => rendered.getByText('a@test.com'))
  })

  test('it should return initial data', async () => {
    const store = new RootStore({
      request: mockCallbackSucces3,
    })

    function Page() {
      const { data } = useQuery(
        (store) =>
          store.query('user', 'getUsers', undefined, {
            initialData: {
              users: [{ id: 'a', typename: 'User', email: 'a@test.com' }],
            },
          }),
        {
          store,
        }
      )

      return <>{data.users[0].email}</>
    }
    const MyPage = observer(Page)
    const rendered = render(<MyPage />)
    await waitFor(() => rendered.getByText('a@test.com'))
  })

  it('should return partial cache response with suspense', async () => {
    const store = new RootStore(
      {
        request: mockCallbackSucces3,
      },
      {
        users: {
          a: {
            id: 'a',
            typename: 'User',
          },
        },
      }
    )
    function Page() {
      const { data, query } = useQuery(
        (store) =>
          store.query('user', 'getUser', undefined, {
            fromCache: ['User', 'a'],
          }),
        {
          store,
          suspense: true,
        }
      )

      if (query.cache) {
        return <>{query.cache.id}</>
      }

      return <>{data.user.email}</>
    }
    const MyPage = observer(Page)
    const rendered = render(
      <React.Suspense fallback="loading...">
        <MyPage />
      </React.Suspense>
    )
    await waitFor(() => rendered.getByText('a'))
    await waitFor(() => rendered.getByText('a@test.com'))
  })

  it('[mobx] suspense mode works', async () => {
    const store = new RootStore({
      request: mockCallbackSuccess,
    })

    function Page() {
      const { data } = useQuery((store) => store.query('user', 'getUsers'), {
        store,
        suspense: true,
      })

      return <>{data.users.map((u) => u.id).join('')}</>
    }
    const MyPage = observer(Page)
    const rendered = render(
      <React.Suspense fallback="loading...">
        <MyPage />
      </React.Suspense>
    )
    await waitFor(() => rendered.getByText('loading...'))
    await waitFor(() => rendered.getByText('ab'))
  })

  it('[mobx] query cache', async () => {
    const _store = new RootStore({
      request: mockCallbackSuccess,
    })
    await _store.query('user', 'getUsers')
    const snapshot = _store.getSnapshot()
    const store = new RootStore(
      {
        request: mockCallbackSuccess,
      },
      JSON.parse(JSON.stringify(snapshot))
    )

    function Page() {
      const { data } = useQuery(
        (store) => store.query('user', 'getUsers', {}),
        {
          store,
        }
      )

      return <>{data.users.map((u) => u.id).join('')}</>
    }
    const MyPage = observer(Page)
    const rendered = render(<MyPage />)
    await waitFor(() => rendered.getByText('ab'))
  })

  it('suspend mode error works', async () => {
    const spy = jest.spyOn(console, 'error')
    spy.mockImplementation(() => {})

    const errorText = 'error boundary text'

    const mockCallbackError = jest
      .fn()
      .mockRejectedValue(new Error('Request failed with status code 400'))
    const store = new RootStore({
      request: mockCallbackError,
    })

    function Page() {
      const { query } = useQuery((store) => store.query('user', 'getUsers'), {
        store,
        suspense: true,
      })

      return <>{query.status}</>
    }
    const MyPage = observer(Page)
    const rendered = render(
      <ErrorBoundary fallbackRender={() => <>{errorText}</>}>
        <React.Suspense fallback="loading...">
          <MyPage />
        </React.Suspense>
      </ErrorBoundary>
    )
    await waitFor(() => rendered.getByText('loading...'))
    await waitFor(() => rendered.getByText(errorText))
    expect(mockCallbackError).toHaveBeenCalledTimes(1)

    spy.mockRestore()
  })

  it('clearing data works', async () => {
    const store = new RootStore({
      request: mockCallbackSuccess2,
    })

    function Page() {
      const { data, loading, query } = useQuery(
        (store) => store.query('user', 'getUsers'),
        {
          store,
        }
      )

      function clear() {
        query.clear()
      }

      if (loading) {
        return null
      }

      if (!data) {
        return <>works</>
      }

      return (
        <>
          {data.users.map((u) => u.id).join('')}
          <button onClick={clear}>clear</button>
        </>
      )
    }
    const MyPage = observer(Page)
    const rendered = render(<MyPage />)
    await waitFor(() => rendered.getByText('ab'))
    fireEvent.click(rendered.getByText('clear'))
    await waitFor(() => rendered.getByText('works'))
    expect(mockCallbackSuccess2).toHaveBeenCalledTimes(1)
  })
})
