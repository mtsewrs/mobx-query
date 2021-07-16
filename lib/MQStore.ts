import { action, makeObservable, observable } from 'mobx'

import { deflateHelper } from './deflateHelper'
import { mergeHelper } from './mergeHelper'
import { Query, QueryOptions } from './Query'

export function getCollectionName(typename: string): string {
  // Pluralize only last word (pluralize may fail with words that are
  // not valid English words as is the case with LongCamelCaseTypeNames)
  return typename.toLowerCase() + 's'
}

type RequestClient = (
  path: string,
  method: string,
  variables: object
) => Promise<any>

export interface StoreOptions {
  request?: RequestClient
  ssr?: boolean
}

interface initialData {
  __queryCacheData?: Map<string, any>
  __queryCache?: Map<string, any>
}

export class MQStore {
  __queryCacheData = new Map()
  __queryCache = new Map()
  ssr: boolean
  __afterInit = false
  __promises = new Map()
  request: RequestClient

  constructor(options: StoreOptions = {}, data: initialData) {
    makeObservable(this, {
      __queryCacheData: observable,
      __queryCache: observable,
      query: action,
      deflate: action,
      mutate: action,
      rawRequest: action,
      merge: action,
      getCollectionName: action,
      __runInStoreContext: action,
      __cacheResponse: action,
    })

    let {
      request,
    }: {
      request?: RequestClient
    } = options

    if (!request) {
      throw new Error('[sact]: Sact requires either a post client or url')
    }

    if (data) {
      this.__queryCacheData = new Map(data.__queryCacheData)
    }

    this.request = request
  }

  getStore = () => {
    return this
  }

  merge(data: unknown) {
    return mergeHelper(this, data)
  }

  deflate(data: unknown) {
    return deflateHelper(data)
  }

  rawRequest(path: string, method: string, variables: any): Promise<any> {
    return this.request(path, method, variables)
  }

  __cacheQuery(key: string, query: any) {
    this.__queryCache.set(key, query)
  }

  query<T>(
    path: string,
    method: string,
    variables?: any,
    options: QueryOptions = {}
  ): Query<T> {
    const key = path + JSON.stringify({ method, ...variables })
    const hasQuery = this.__queryCache.get(key)
    if (hasQuery) {
      return hasQuery
    }
    const query = new Query<T>(this.getStore, path, method, variables, options)
    this.__cacheQuery(path + JSON.stringify({ method, ...variables }), query)
    return query
  }

  mutate<T>(
    path: string,
    method: string,
    variables?: any,
    optimisticUpdate?: (store: any) => void
  ): Query<T> {
    if (optimisticUpdate) {
      optimisticUpdate(this)
      const q = this.query<T>(path, method, variables, {
        fetchPolicy: 'network-only',
      })
      return q
    } else {
      return this.query(path, method, variables, {
        fetchPolicy: 'network-only',
      })
    }
  }

  getCollectionName = getCollectionName
  __pushPromise(promise: Promise<{}>, queryKey: string) {
    this.__promises.set(queryKey, promise)
    const onSettled = () => {
      this.__promises.delete(queryKey)
    }
    const onError = () => {
      this.__promises.delete(queryKey)
    }
    promise.then(onSettled, onError)
  }
  __runInStoreContext<T>(fn: () => T) {
    return fn()
  }
  __cacheResponse(key: string, response: any) {
    this.__queryCacheData.set(key, response)
  }
}

export type StoreType = typeof MQStore
