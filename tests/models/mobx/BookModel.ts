import { BookModelBase } from './base/BookModel.base'
import { RootStoreBase, Data } from './base/root.base'

export type BookType = BookModel

export type BookData = Omit<BookType, 'update' | 'author' 

 | 'publisher'

 | 'tags'
>

export class BookModel extends BookModelBase {
  constructor(store: RootStoreBase, data: Data) {
    super(store, data)
  }
}