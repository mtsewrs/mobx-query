import { RootStoreBase, Data } from './base/root.base'
import { BookTagModelBase, BookTagModelBaseType } from './base/model.base'

export type BookTagType = BookTagModel

export type BookTagData = BookTagModelBaseType

export class BookTagModel extends BookTagModelBase {
  constructor(getStore: () => RootStoreBase, data: Data) {
    super(getStore, data)
  }
}
