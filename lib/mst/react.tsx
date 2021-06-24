import { Query } from './Query'
import { MSTGQLStore } from './MSTGQLStore'
import { Instance } from 'mobx-state-tree'

// import react namespace only; statement gets removed after transpiling
declare var ReactNamespace: typeof import('react')

export type QueryLike<STORE, DATA> = (store: STORE) => Query<DATA>

export function createStoreContext<STORE extends Instance<typeof MSTGQLStore>>(
  React: typeof ReactNamespace
) {
  return React.createContext<STORE>(null as any)
}

export async function getDataFromTree<
  STORE extends Instance<typeof MSTGQLStore>
>(
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

export function createUseQueryHook<STORE extends Instance<typeof MSTGQLStore>>(
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
