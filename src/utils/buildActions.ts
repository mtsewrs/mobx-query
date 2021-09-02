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
      action.variables = a.variables
      let type = a.type
      for (let k = 0; k < modelNames.length; k++) {
        const m = modelNames[k]
        if (type === m) {
          type = a.type + 'Model'
        } else if (type.replace('[]', '') === m) {
          type = a.type.replace(m, m + 'Model')
        }
      }
      action.type = type

      actions.push(action)
    }

    nm.actions = actions
  }
}
