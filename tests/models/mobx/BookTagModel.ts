import { BookTagModelBase } from './base/BookTagModel.base'
import { RootStoreBase, Data } from './base/root.base'

export type BookTagType = BookTagModel

export type BookTagData = Omit<BookTagType, 'update' | 'books' 
>

export class BookTagModel extends BookTagModelBase {
  constructor(store: RootStoreBase, data: Data) {
    super(store, data)
  }
}