import { Query } from './Query'
import { MQStore } from './MQStore'

// import react namespace only; statement gets removed after transpiling
declare var ReactNamespace: typeof import('react')

export type QueryLike<STORE, DATA> = (store: STORE) => Query<DATA>

export function createStoreContext<STORE extends MQStore>(
  React: typeof ReactNamespace
) {
  return React.createContext<STORE>(null as any)
}

/**
 * note this will render your whole react tree which might not be great for performance
 */
export async function getDataFromTree<STORE extends MQStore>(
  tree: React.ReactElement<any>,
  client: STORE,
  renderFunction: (
    tree: React.ReactElement<any>
  ) => string = require('react-dom/server').renderToStaticMarkup
): Promise<string> {
  while (true) {
    const html = renderFunction(tree)
    if (client.__promises.size === 0) {
      return html
    }
    await Promise.all(client.__promises.values())
  }
}

export type UseQueryHookOptions<STORE> = {
  store?: STORE
  suspense?: boolean
}

export type UseQueryHookResult<STORE, DATA> = {
  store: STORE
  loading?: boolean
  error: any
  data: { [key in keyof DATA]: DATA[key] } | undefined
  query: Query<DATA> | undefined
  setQuery: (query: QueryLike<STORE, DATA>) => void
}

export type UseQueryHook<STORE> = <DATA>(
  query?: QueryLike<STORE, DATA>,
  options?: UseQueryHookOptions<STORE>
) => UseQueryHookResult<STORE, DATA>

export function createUseQueryHook<STORE extends MQStore>(
  context: React.Context<STORE>,
  React: typeof ReactNamespace
): UseQueryHook<STORE> {
  return function<DATA>(
    queryIn: undefined | QueryLike<STORE, DATA> = undefined,
    opts: UseQueryHookOptions<STORE> = {}
  ) {
    const store = (opts && opts.store) || React.useContext(context)

    const [query, setQuery] = React.useState<Query<DATA> | undefined>(() => {
      if (!queryIn) return undefined
      return queryIn(store)
    })

    const setQueryHelper = React.useCallback(
      (newQuery: QueryLike<STORE, DATA>) => {
        setQuery(newQuery(store))
      },
      [queryIn]
    )

    React.useEffect(() => {
      if (!queryIn || typeof queryIn === 'function') return // ignore changes to initializer func
      setQueryHelper(queryIn)
    }, [queryIn])

    if (opts.suspense) {
      if (query.status === 'pending') {
        throw query.promise
      } else if (query.status === 'error') {
        throw query.error
      }
    }

    return {
      store,
      loading: query ? query.loading : false,
      error: query && query.error,
      data: query && query.data,
      status: query.status,
      query,
      setQuery: setQueryHelper
    }
  }
}
