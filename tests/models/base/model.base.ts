/* This is a mobx-query generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { observable, makeObservable, computed, action } from 'mobx'
import { RootStoreBase } from './root.base'
import { UserType } from '../UserModel'
import { BookType } from '../BookModel'
import { BookTagType } from '../BookTagModel'
import { PublisherType } from '../PublisherModel'
const knownBookProperties = [
  'typename',
  'id',
  'title',
  'author',
  'publisher',
  'tags',
  'metaArrayOfStrings',
]
export type BookModelBaseType = Omit<
  BookModelBase,
  'update' | 'author' | 'publisher' | 'tags'
>

export class BookModelBase {
  getStore?: () => RootStoreBase
  relationNames?: string[] = ['author', 'publisher', 'tags']
  typename?: string = null
  id: string
  title?: string = null
  author_id?: string = null
  get author(): UserType | undefined {
    return this.getStore().users.get(this.author_id)
  }
  set author(author) {
    this.author_id = author.id
  }
  publisher_id?: string = null
  get publisher(): PublisherType | undefined {
    return this.getStore().publishers.get(this.publisher_id)
  }
  set publisher(publisher) {
    this.publisher_id = publisher.id
  }
  tags_id?: string[] = []
  get tags(): BookTagType[] | undefined {
    return this.tags_id.map((id) => this.getStore().booktags.get(id))
  }
  set tags(tags) {
    this.tags_id = tags.map((m) => m.id)
  }
  metaArrayOfStrings?: any = null

  constructor(getStore: () => RootStoreBase, data: any) {
    this.getStore = getStore
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const fieldData = data[key]
      if (this.relationNames.includes(key)) {
        const relationKey = key + '_id'
        if (Array.isArray(this[relationKey])) {
          for (let i = 0; i < data[key].length; i++) {
            const element = data[key][i]
            this[relationKey].push(element.id)
          }
        } else {
          this[relationKey] = fieldData.id
        }
      } else {
        if (knownBookProperties.includes(key)) {
          this[key] = fieldData
        }
      }
    }

    this.typename = this.constructor.name

    makeObservable(this, {
      update: action,
      typename: observable,
      id: observable,
      title: observable,
      author_id: observable,
      author: computed,
      publisher_id: observable,
      publisher: computed,
      tags_id: observable,
      tags: computed,
      metaArrayOfStrings: observable,
    })
  }

  update(snapshot: BookType) {
    const keys = Object.keys(snapshot)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (knownBookProperties.includes(key)) {
        this[key] = snapshot[key]
      }
    }
  }
}
const knownUserProperties = [
  'typename',
  'id',
  'created_at',
  'updated_at',
  'name',
  'email',
  'password',
  'books',
  'friend',
  'favouriteBook',
]
export type UserModelBaseType = Omit<
  UserModelBase,
  'update' | 'books' | 'friend' | 'favouriteBook'
>

export class UserModelBase {
  getStore?: () => RootStoreBase
  relationNames?: string[] = ['books', 'friend', 'favouriteBook']
  typename?: string = null
  id: string
  created_at?: string = null
  updated_at?: Date = null
  name?: string = null
  email?: string = null
  password?: string = null
  books_id?: string[] = []
  get books(): BookType[] | undefined {
    return this.books_id.map((id) => this.getStore().books.get(id))
  }
  set books(books) {
    this.books_id = books.map((m) => m.id)
  }
  friend_id?: string = null
  get friend(): UserType | undefined {
    return this.getStore().users.get(this.friend_id)
  }
  set friend(friend) {
    this.friend_id = friend.id
  }
  favouriteBook_id?: string = null
  get favouriteBook(): BookType | undefined {
    return this.getStore().books.get(this.favouriteBook_id)
  }
  set favouriteBook(favouriteBook) {
    this.favouriteBook_id = favouriteBook.id
  }

  constructor(getStore: () => RootStoreBase, data: any) {
    this.getStore = getStore
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const fieldData = data[key]
      if (this.relationNames.includes(key)) {
        const relationKey = key + '_id'
        if (Array.isArray(this[relationKey])) {
          for (let i = 0; i < data[key].length; i++) {
            const element = data[key][i]
            this[relationKey].push(element.id)
          }
        } else {
          this[relationKey] = fieldData.id
        }
      } else {
        if (knownUserProperties.includes(key)) {
          this[key] = fieldData
        }
      }
    }

    this.typename = this.constructor.name

    makeObservable(this, {
      update: action,
      typename: observable,
      id: observable,
      created_at: observable,
      updated_at: observable,
      name: observable,
      email: observable,
      password: observable,
      books_id: observable,
      books: computed,
      friend_id: observable,
      friend: computed,
      favouriteBook_id: observable,
      favouriteBook: computed,
    })
  }

  update(snapshot: UserType) {
    const keys = Object.keys(snapshot)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (knownUserProperties.includes(key)) {
        this[key] = snapshot[key]
      }
    }
  }
}
const knownBookTagProperties = ['typename', 'id', 'name', 'books']
export type BookTagModelBaseType = Omit<BookTagModelBase, 'update' | 'books'>

export class BookTagModelBase {
  getStore?: () => RootStoreBase
  relationNames?: string[] = ['books']
  typename?: string = null
  id: string
  name?: string = null
  books_id?: string[] = []
  get books(): BookType[] | undefined {
    return this.books_id.map((id) => this.getStore().books.get(id))
  }
  set books(books) {
    this.books_id = books.map((m) => m.id)
  }

  constructor(getStore: () => RootStoreBase, data: any) {
    this.getStore = getStore
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const fieldData = data[key]
      if (this.relationNames.includes(key)) {
        const relationKey = key + '_id'
        if (Array.isArray(this[relationKey])) {
          for (let i = 0; i < data[key].length; i++) {
            const element = data[key][i]
            this[relationKey].push(element.id)
          }
        } else {
          this[relationKey] = fieldData.id
        }
      } else {
        if (knownBookTagProperties.includes(key)) {
          this[key] = fieldData
        }
      }
    }

    this.typename = this.constructor.name

    makeObservable(this, {
      update: action,
      typename: observable,
      id: observable,
      name: observable,
      books_id: observable,
      books: computed,
    })
  }

  update(snapshot: BookTagType) {
    const keys = Object.keys(snapshot)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (knownBookTagProperties.includes(key)) {
        this[key] = snapshot[key]
      }
    }
  }
}
const knownPublisherProperties = ['typename', 'id', 'name', 'books']
export type PublisherModelBaseType = Omit<
  PublisherModelBase,
  'update' | 'books'
>

export class PublisherModelBase {
  getStore?: () => RootStoreBase
  relationNames?: string[] = ['books']
  typename?: string = null
  id: string
  name?: string = null
  books_id?: string[] = []
  get books(): BookType[] | undefined {
    return this.books_id.map((id) => this.getStore().books.get(id))
  }
  set books(books) {
    this.books_id = books.map((m) => m.id)
  }

  constructor(getStore: () => RootStoreBase, data: any) {
    this.getStore = getStore
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const fieldData = data[key]
      if (this.relationNames.includes(key)) {
        const relationKey = key + '_id'
        if (Array.isArray(this[relationKey])) {
          for (let i = 0; i < data[key].length; i++) {
            const element = data[key][i]
            this[relationKey].push(element.id)
          }
        } else {
          this[relationKey] = fieldData.id
        }
      } else {
        if (knownPublisherProperties.includes(key)) {
          this[key] = fieldData
        }
      }
    }

    this.typename = this.constructor.name

    makeObservable(this, {
      update: action,
      typename: observable,
      id: observable,
      name: observable,
      books_id: observable,
      books: computed,
    })
  }

  update(snapshot: PublisherType) {
    const keys = Object.keys(snapshot)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (knownPublisherProperties.includes(key)) {
        this[key] = snapshot[key]
      }
    }
  }
}
