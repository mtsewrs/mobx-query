export function mergeHelper(store: any, data: any) {
  function merge(data: any): any {
    if (!data || typeof data !== 'object') return data
    if (Array.isArray(data)) return data.map(merge)

    const { typename, id } = data

    // convert values deeply first to mobx objects as much as possible
    const snapshot: any = {}
    for (const key in data) {
      snapshot[key] = merge(data[key])
    }

    // GQL object
    if (typename && store.isKnownType(typename)) {
      // GQL object with known type, instantiate or recycle MST object
      const typeDef = store.getTypeDef(typename)
      // Try to reuse instance, even if it is not a root type
      let instance: any =
        id !== undefined && store[store.getCollectionName(typename)].get(id)
      if (instance) {
        // update existing object
        instance.update(snapshot)
      } else {
        // create a new one
        instance = new typeDef(store.getStore, snapshot)
        if (store.isRootType(typename)) {
          // register in the store if a root
          store[store.getCollectionName(typename)].set(id, instance)
        }
        // instance.__setStore(store)
      }
      return instance
    } else {
      // GQL object with unknown type, return verbatim
      return snapshot
    }
  }

  return merge(data)
}
