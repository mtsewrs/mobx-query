import { RootStoreBase, Data } from './base/root.base'
import { BookModelBase, BookModelBaseType } from './base/model.base'

export type BookType = BookModel

export type BookData = BookModelBaseType

export class BookModel extends BookModelBase {
  constructor(getStore: () => RootStoreBase, data: Data) {
    super(getStore, data)
  }
}
