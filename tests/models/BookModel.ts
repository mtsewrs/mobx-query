import { Data } from './base/root.base'
import { RootStore } from './root'
import { BookModelBase, BookModelBaseType } from './base/model.base'

export type BookData = BookModelBaseType

export class BookModel extends BookModelBase {
  constructor(store: () => RootStore, data: Data) {
    super(store, data)
  }
}
