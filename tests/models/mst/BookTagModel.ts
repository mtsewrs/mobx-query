import { Instance } from 'mobx-state-tree'
import { BookTagModelBase } from './base/BookTagModel.base'

export interface BookTagType extends Instance<typeof BookTagModel> {}

export const BookTagModel = BookTagModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self))
  }
}))
