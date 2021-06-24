import { schema } from './schema'

export const buildArg = (
  actionName: string,
  name: string,
  type: string,
  required: any
) => {
  const action = schema.actions.get(actionName)
  schema.actions.set(actionName, {
    ...action,
    args: [
      ...action.args,
      {
        name,
        type: type,
        required: !!required
      }
    ]
  })
}
