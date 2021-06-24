import { Instance } from 'mobx-state-tree'
import { <%= props.model.name %>ModelBase } from './base/<%= props.model.name %>Model.base'

export interface <%= props.model.name %>Type extends Instance<typeof <%= props.model.name %>Model> {}

export const <%= props.model.name %>Model = <%= props.model.name %>ModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))