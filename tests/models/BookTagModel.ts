import { Data } from './base/root.base'
import { RootStore } from './root'
import { BookTagModelBase, BookTagModelBaseType } from './base/model.base'

export type BookTagData = BookTagModelBaseType

export class BookTagModel extends BookTagModelBase {
  constructor(store: () => RootStore, data: Data) {
    super(store, data)
  }
}
