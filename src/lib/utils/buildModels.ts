import { schema } from './schema'

export const buildModels = (schema_models: any): void => {
  const models = Object.keys(schema_models)

  for (let i = 0; i < models.length; i++) {
    const modelName = models[i]

    const properties = schema_models[modelName]
    const types = Object.keys(schema_models[modelName])
    for (let j = 0; j < types.length; j++) {
      const property = types[j]
      const [type, ref] = properties[property]
      if (!schema.models.has(modelName)) {
        schema.models.set(modelName, {
          types: [
            {
              name: property,
              type,
              ref
            }
          ],
          hasJson: type === 'json',
          name: modelName,
          relations: ref ? [ref] : [],
          relationNames: ref ? [property] : []
        })
      } else {
        const model = schema.models.get(modelName)
        schema.models.set(modelName, {
          ...model,
          hasJson: model.hasJson ? model.hasJson : type === 'json',
          relations: ref
            ? [...model.relations, ref].filter((v, i, a) => a.indexOf(v) === i)
            : model.relations,
          relationNames: ref
            ? [...model.relationNames, property].filter(
                (v, i, a) => a.indexOf(v) === i
              )
            : model.relationNames,
          types: [
            ...model.types,
            {
              name: property,
              type,
              ref
            }
          ]
        })
      }
    }
  }
}
