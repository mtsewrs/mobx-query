import { Instance } from 'mobx-state-tree'
import { PublisherModelBase } from './base/PublisherModel.base'

export interface PublisherType extends Instance<typeof PublisherModel> {}

export const PublisherModel = PublisherModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self))
  }
}))
