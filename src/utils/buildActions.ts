export const buildActions = (config: any) => {
  const modelNames = config.models.map((n) => n.name)
  for (let i = 0; i < config.namespaces.length; i++) {
    const nm = config.namespaces[i]
    const actions = []
    for (let j = 0; j < nm.actions.length; j++) {
      const action: any = {
        path: nm.namespace,
      }
      const a = nm.actions[j]
      action.name = a.name
      action.type = modelNames.includes(a.type) ? a.type + 'Type' : a.type
      action.args = []
      if (a.variables) {
        for (let k = 0; k < a.variables.length; k++) {
          const v = a.variables[k]
          action.args.push({ name: v.name, type: v.type })
        }
      }

      actions.push(action)
    }

    nm.actions = actions
  }
}
