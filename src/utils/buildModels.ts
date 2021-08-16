export const buildModels = (config: any): void => {
  for (let i = 0; i < config.models.length; i++) {
    const model = config.models[i]
    const relations = []
    const relationNames = []

    for (let j = 0; j < model.properties.length; j++) {
      const p = model.properties[j]
      if (p.ref_type) {
        relations.push(p.type)
        relationNames.push(p.name)
      }
    }

    model.relations = relations.filter((v, i, a) => a.indexOf(v) === i)
    model.relationNames = relationNames.filter((v, i, a) => a.indexOf(v) === i)
  }
}
