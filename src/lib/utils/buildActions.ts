import { buildAction } from './buildAction'
import { buildArg } from './buildArg'

export const buildActions = (namespace: string, actions: any): void => {
  const keys = Object.keys(actions)

  for (let i = 0; i < keys.length; i++) {
    const name = keys[i]
    const action = actions[name]

    buildAction(namespace, name, action)

    if (action.args) {
      const args = Object.keys(action.args)

      for (let j = 0; j < args.length; j++) {
        const argName = args[j]
        const arg = action.args[argName]
        buildArg(name, argName, arg.type, arg.required)
      }
    }
  }
}
