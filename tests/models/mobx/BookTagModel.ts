import { BookTagModelBase } from './base/BookTagModel.base'

export type BookTagType = BookTagModel

export type BookTagData = Omit<BookTagType, 'update' | 'books'>

export class BookTagModel extends BookTagModelBase {
  constructor(store: any, data: any) {
    super(store, data)
  }
}
