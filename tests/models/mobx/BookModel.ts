import { BookModelBase } from './base/BookModel.base'

export type BookType = BookModel

export type BookData = Omit<
  BookType,
  'update' | 'author' | 'publisher' | 'tags'
>

export class BookModel extends BookModelBase {
  constructor(store: any, data: any) {
    super(store, data)
  }
}
