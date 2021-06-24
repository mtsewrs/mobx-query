import {
  getEnv,
  IAnyModelType,
  Instance,
  recordPatches,
  types
} from 'mobx-state-tree'
import pluralize from 'pluralize'
import { deflateHelper } from './deflateHelper'
import { mergeHelper } from './mergeHelper'
import { Query, QueryOptions } from './Query'

type RequestClient = (
  path: string,
  method: string,
  variables: object
) => Promise<any>

export function camelcase(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

export function getCollectionName(typename: string): string {
  // Pluralize only last word (pluralize may fail with words that are
  // not valid English words as is the case with LongCamelCaseTypeNames)
  const newName = camelcase(typename)
  const parts = newName.split(/(?=[A-Z])/)
  parts[parts.length - 1] = pluralize(parts[parts.length - 1])
  return parts.join('')
}

export const MSTGQLStore = types
  .model('MSTGQLStore', {
    __queryCacheData: types.optional(types.map(types.frozen()), {}),
    __queryCache: types.optional(types.map(types.frozen()), {})
  })
  .volatile((self): {
    ssr: boolean
    __promises: Map<string, Promise<unknown>>
    __afterInit: boolean
  } => {
    const {
      ssr = false
    }: {
      ssr: boolean
    } = getEnv(self)
    return {
      ssr,
      __promises: new Map(),
      __afterInit: false
    }
  })
  .actions(self => {
    let {
      request
    }: {
      request: RequestClient
    } = getEnv(self)

    if (!request) {
      throw new Error('[sact]: Sact requires either a axios instance or url')
    }

    function merge(data: unknown) {
      return mergeHelper(self, data)
    }

    function deflate(data: unknown) {
      return deflateHelper(self, data)
    }

    function rawRequest(
      path: string,
      method: string,
      variables: any
    ): Promise<any> {
      return request(path, method, variables)
    }

    function __cacheQuery(key: string, query: any) {
      self.__queryCache.set(key, query)
    }

    function query<T>(
      path: string,
      method: string,
      variables?: any,
      options: QueryOptions = {}
    ): Query<T> {
      const key = path + JSON.stringify({ method, ...variables })
      const hasQuery = self.__queryCache.get(key)
      if (hasQuery) {
        return hasQuery
      }
      const query = new Query<T>(self as any, path, method, variables, options)
      __cacheQuery(path + JSON.stringify({ method, ...variables }), query)
      return query
    }

    function mutate<T>(
      path: string,
      method: string,
      variables?: any,
      optimisticUpdate?: (store: any) => void
    ): Query<T> {
      if (optimisticUpdate) {
        const recorder = recordPatches(self)
        optimisticUpdate(self)
        recorder.stop()
        const q = query<T>(path, method, variables, {
          fetchPolicy: 'network-only'
        })
        q.currentPromise().catch(() => {
          recorder.undo()
        })
        return q
      } else {
        return query(path, method, variables, {
          fetchPolicy: 'network-only'
        })
      }
    }

    // exposed actions
    return {
      merge,
      deflate,
      mutate,
      query,
      rawRequest,
      __cacheQuery,
      __pushPromise(promise: Promise<{}>, queryKey: string) {
        self.__promises.set(queryKey, promise)
        const onSettled = () => {
          self.__promises.delete(queryKey)
        }
        const onError = () => {
          self.__promises.delete(queryKey)
        }
        promise.then(onSettled, onError)
      },
      __runInStoreContext<T>(fn: () => T) {
        return fn()
      },
      __cacheResponse(key: string, response: any) {
        self.__queryCacheData.set(key, response)
      },
      afterCreate() {
        self.__afterInit = true
      }
    }
  })

export function configureStoreMixin(
  knownTypes: [string, () => IAnyModelType][],
  rootTypes: string[]
) {
  const kt = new Map()
  const rt = new Set(rootTypes)
  return () => ({
    actions: {
      afterCreate() {
        // initialized lazily, so that there are no circular dep issues
        knownTypes.forEach(([key, typeFn]) => {
          const type = typeFn()
          if (!type)
            throw new Error(
              `The type provided for '${key}' is empty. Probably this is a module loading issue`
            )
          kt.set(key, type)
        })
      }
    },
    views: {
      isKnownType(typename: string): boolean {
        return kt.has(typename)
      },
      isRootType(typename: string): boolean {
        return rt.has(typename)
      },
      getTypeDef(typename: string): IAnyModelType {
        return kt.get(typename)!
      },
      getCollectionName
    }
  })
}

export type StoreType = Instance<typeof MSTGQLStore>
