import { MQStore, getCollectionName } from './MQStore'
import { action, observable, makeObservable, computed } from 'mobx'

export type CaseHandlers<T, R> = {
  loading(): R
  error(error: any): R
  data(data: T): R
}

export type FetchPolicy =
  | 'cache-first' // Use cache if available, avoid network request if possible
  | 'cache-only' // Use cache if available, or error
  | 'cache-and-network' // Use cache, but still send request and update cache in the background
  | 'network-only' // Skip cache, but cache the result
  | 'no-cache' // Skip cache, and don't cache the response either

export interface QueryOptions {
  fetchPolicy?: FetchPolicy
  noSsr?: boolean
  /**
   * specify the typename and id of the object you want to retrieve
   * e.g. ['User', 'some-id']
   */
  cacheKey?: [string, string]
}

export type status = 'pending' | 'success' | 'error' | 'cache'

const isServer: boolean = typeof window === 'undefined'

export class Query<T = unknown> implements PromiseLike<T> {
  loading = false
  data: T | undefined = undefined
  error: any = undefined
  status: status = undefined
  /**
   * this will return a single model if it exists in the cache otherwise it will return false
   */
  get cache(): T {
    return this.loading && this.status === 'cache' ? this.data : null
  }

  store: () => MQStore
  public path: string
  public method: string
  public promise!: Promise<T>
  private fetchPolicy: FetchPolicy
  private queryKey: string

  constructor(
    store: () => MQStore,
    path: string,
    method: string,
    public variables: any,
    public options: QueryOptions = {}
  ) {
    makeObservable(this, {
      loading: observable,
      data: observable.ref,
      error: observable,
      status: observable,
      clear: action,
      cache: computed,
    })

    this.store = store

    let fetchPolicy = options.fetchPolicy || 'cache-first'

    this.path = path
    this.method = method
    this.queryKey =
      this.path +
      JSON.stringify({ method: this.method, fetchPolicy, ...variables })

    const _store = this.store()

    if (_store.ssr && !this.options.noSsr && isServer) {
      fetchPolicy = 'cache-first'
    }
    this.fetchPolicy = fetchPolicy

    if (_store.ssr && this.options.noSsr && isServer) {
      this.promise = Promise.resolve() as any
      return
    }

    const inCache = _store.__queryCacheData.has(this.queryKey)
    if (options.cacheKey) {
      const [modelName, key] = options.cacheKey
      const model = getCollectionName(modelName)
      if (!_store[model]) {
        throw new Error('[Query] typename not found')
      }
      const fromCache = _store[model].has(key)
      if (fromCache) {
        this.status = 'cache'
        this.data = _store[model].get(key)
      }
    }

    switch (this.fetchPolicy) {
      case 'no-cache':
      case 'network-only':
        this.fetchResults()
        break
      case 'cache-only':
        if (!inCache) {
          this.error = new Error(
            `No results for query ${this.method} found in cache, and policy is cache-only`
          )
          this.status = 'error'
          this.promise = Promise.reject(this.error)
        } else {
          this.useCachedResults()
        }
        break
      case 'cache-and-network':
        if (inCache) {
          this.useCachedResults()
          this.refetch() // refetch async, so that callers chaining to the initial promise should resovle immediately!
        } else {
          this.fetchResults()
        }
        break
      case 'cache-first':
        if (inCache) {
          this.useCachedResults()
        } else {
          this.fetchResults()
        }
        break
      default:
        throw new Error('[Query] unknown fetch policy')
    }
  }

  clear = (): void => {
    this.data = null
  }

  refetch = (): Promise<T> => {
    return Promise.resolve().then(
      action(() => {
        if (!this.loading) {
          this.fetchResults()
        }
        this.status = 'success'
        return this.promise
      })
    )
  }

  private async fetchResults() {
    const store = this.store()
    this.loading = true
    if (this.status !== 'cache') this.status = 'pending'
    let promise: Promise<T>
    const existingPromise = store.__promises.get(this.queryKey)
    if (existingPromise) {
      promise = existingPromise as Promise<T>
    } else {
      promise = store.rawRequest(this.path, this.method, this.variables)
      store.__pushPromise(promise, this.queryKey)
    }
    promise = promise
      .then((data: any) => {
        // cache query and response
        if (this.fetchPolicy !== 'no-cache') {
          store.__cacheResponse(this.queryKey, data)
        }
        return Promise.resolve(store.merge(data))
      })
      .then(
        action((data: any) => {
          this.status = 'success'
          this.loading = false
          this.error = false
          this.data = data
          return data
        }),
        action((error: any): any => {
          this.status = 'error'
          this.loading = false
          this.error = error
        })
      )

    this.promise = promise
  }

  private useCachedResults() {
    const store = this.store()
    this.status = 'success'
    this.data = store.merge(store.__queryCacheData.get(this.queryKey))
    this.promise = Promise.resolve(this.data!)
  }

  case<R>(handlers: CaseHandlers<T, R>): R {
    return this.loading && !this.data
      ? handlers.loading()
      : this.error
      ? handlers.error(this.error)
      : handlers.data(this.data!)
  }

  currentPromise() {
    return this.promise
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): PromiseLike<TResult1 | TResult2>
  then(onfulfilled: any, onrejected: any) {
    const store = this.store()
    return this.promise
      .then((d) => {
        store.__runInStoreContext(() => onfulfilled && onfulfilled(d))
      })
      .catch((e) => {
        store.__runInStoreContext(() => onrejected && onrejected(e))
      })
  }
}
