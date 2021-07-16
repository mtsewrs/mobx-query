import { MQStore } from './MQStore'

export function setTypes(
  self: MQStore,
  kt: Map<string, any>,
  knownTypes: [string, () => any][],
  data = {}
) {
  knownTypes.forEach(([key, typeFn]) => {
    const type = typeFn()
    if (!type)
      throw new Error(
        `The type provided for '${key}' is empty. This is probably a module loading issue`
      )
    kt.set(key, type)
  })

  const modelKeys = Object.keys(data)
  for (let i = 0; i < modelKeys.length; i++) {
    const key = modelKeys[i]

    if (key === '__queryCacheData' || key === '__queryCache') continue
    const model = self[key]

    const ids = Object.keys(data[key])

    for (let j = 0; j < ids.length; j++) {
      const id = ids[j]
      const typeDef = kt.get(data[key][id].typename)!
      if (typeDef) {
        model.set(id, new typeDef(self.getStore, data[key][id]))
      }
    }
  }
}
