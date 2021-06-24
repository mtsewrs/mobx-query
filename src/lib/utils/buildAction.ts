import { schema } from './schema'

export const buildAction = (
  namespace: string,
  propertyKey: string,
  action: any
) => {
  if (!schema.actions.has(propertyKey)) {
    schema.actions.set(propertyKey, {
      name: propertyKey,
      returnType: Array.from(schema.models.keys()).includes(
        action.returnType && action.returnType.replace('[]', '')
      )
        ? 'I' + action.returnType
        : action.returnType,
      args: [],
      type: action.type,
      path: namespace.toLowerCase()
    })
  } else {
    const action = schema.actions.get(propertyKey)
    schema.actions.set(propertyKey, {
      ...action,
      returnType: Array.from(schema.models.keys()).includes(
        action.returnType && action.returnType.replace('[]', '')
      )
        ? 'I' + action.returnType
        : action.returnType,
      name: propertyKey,
      type: action.type,
      path: namespace.toLowerCase()
    })
  }
}
