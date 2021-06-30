import { Instance } from 'mobx-state-tree'
import { BookModelBase } from './base/BookModel.base'

export interface BookType extends Instance<typeof BookModel> {}

export const BookModel = BookModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))