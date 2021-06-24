import { MSTGQLObject } from '<%- props.test ? '../../../../lib/mst' : 'mobx-query/mst' %>'

export const ModelBase = MSTGQLObject.actions(self => ({
  // This is an auto-generated example action.
  update(data = {}) {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      self[key] = data[key]
    }
  }
}))