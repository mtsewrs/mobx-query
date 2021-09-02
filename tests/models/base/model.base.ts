/* This is a mobx-query generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { observable, makeObservable, computed, action } from 'mobx'
import { RootStore } from '../root'
import { UserModel } from '../UserModel'
import { BookModel } from '../BookModel'
import { BookTagModel } from '../BookTagModel'
import { PublisherModel } from '../PublisherModel'
enum Role {
  USER,
  ADMIN,
  SUPERUSER,
}
const knownUserProperties = [
  'id',
  'typename',
  'created_at',
  'updated_at',
  'name',
  'email',
  'password',
  'role',
  'books',
  'friend',
  'favouriteBook',
]
export type UserModelBaseType = Omit<
  UserModelBase,
  'update' | 'store' | 'relationNames' | 'books' | 'friend' | 'favouriteBook'
>

export interface UserFields {
  created_at?: string
  updated_at?: string
  name?: string
  email?: string
  password?: string
  role?: Role
}

export class UserModelBase {
  store?: () => RootStore
  relationNames?: string[] = ['books', 'friend', 'favouriteBook']
  id: string
  typename: string
  created_at?: string = null
  updated_at?: string = null
  name?: string = null
  email?: string = null
  password?: string = null
  role?: Role = null
  books_id?: string[] = []
  get books(): BookModel[] | undefined {
    return this.books_id.map((id) => this.store().books.get(id))
  }
  set books(books) {
    this.books_id = books.map((m) => m.id)
  }
  friend_id?: string = null
  get friend(): UserModel | undefined {
    return this.store().users.get(this.friend_id)
  }
  set friend(friend) {
    this.friend_id = friend.id
  }
  favouriteBook_id?: string = null
  get favouriteBook(): BookModel | undefined {
    return this.store().books.get(this.favouriteBook_id)
  }
  set favouriteBook(favouriteBook) {
    this.favouriteBook_id = favouriteBook.id
  }

  constructor(store: () => RootStore, data: any) {
    this.store = store
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

    makeObservable(this, {
      update: action,
      created_at: observable,
      updated_at: observable,
      name: observable,
      email: observable,
      password: observable,
      role: observable,
      books_id: observable,
      books: computed,
      friend_id: observable,
      friend: computed,
      favouriteBook_id: observable,
      favouriteBook: computed,
    })
  }

  update(snapshot: UserFields) {
    const keys = Object.keys(snapshot)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (knownUserProperties.includes(key)) {
        this[key] = snapshot[key]
      }
    }
  }
}
const knownBookProperties = [
  'id',
  'typename',
  'title',
  'author',
  'publisher',
  'tags',
  'metaArrayOfStrings',
]
export type BookModelBaseType = Omit<
  BookModelBase,
  'update' | 'store' | 'relationNames' | 'author' | 'publisher' | 'tags'
>

export interface BookFields {
  title?: string
  metaArrayOfStrings?: any
}

export class BookModelBase {
  store?: () => RootStore
  relationNames?: string[] = ['author', 'publisher', 'tags']
  id: string
  typename: string
  title?: string = null
  author_id?: string = null
  get author(): UserModel | undefined {
    return this.store().users.get(this.author_id)
  }
  set author(author) {
    this.author_id = author.id
  }
  publisher_id?: string = null
  get publisher(): PublisherModel | undefined {
    return this.store().publishers.get(this.publisher_id)
  }
  set publisher(publisher) {
    this.publisher_id = publisher.id
  }
  tags_id?: string[] = []
  get tags(): BookTagModel[] | undefined {
    return this.tags_id.map((id) => this.store().booktags.get(id))
  }
  set tags(tags) {
    this.tags_id = tags.map((m) => m.id)
  }
  metaArrayOfStrings?: any = null

  constructor(store: () => RootStore, data: any) {
    this.store = store
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

    makeObservable(this, {
      update: action,
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

  update(snapshot: BookFields) {
    const keys = Object.keys(snapshot)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (knownBookProperties.includes(key)) {
        this[key] = snapshot[key]
      }
    }
  }
}
const knownPublisherProperties = ['id', 'typename', 'name', 'books']
export type PublisherModelBaseType = Omit<
  PublisherModelBase,
  'update' | 'store' | 'relationNames' | 'books'
>

export interface PublisherFields {
  name?: string
}

export class PublisherModelBase {
  store?: () => RootStore
  relationNames?: string[] = ['books']
  id: string
  typename: string
  name?: string = null
  books_id?: string[] = []
  get books(): BookModel[] | undefined {
    return this.books_id.map((id) => this.store().books.get(id))
  }
  set books(books) {
    this.books_id = books.map((m) => m.id)
  }

  constructor(store: () => RootStore, data: any) {
    this.store = store
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

    makeObservable(this, {
      update: action,
      name: observable,
      books_id: observable,
      books: computed,
    })
  }

  update(snapshot: PublisherFields) {
    const keys = Object.keys(snapshot)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (knownPublisherProperties.includes(key)) {
        this[key] = snapshot[key]
      }
    }
  }
}
const knownBookTagProperties = ['id', 'typename', 'name', 'books']
export type BookTagModelBaseType = Omit<
  BookTagModelBase,
  'update' | 'store' | 'relationNames' | 'books'
>

export interface BookTagFields {
  name?: string
}

export class BookTagModelBase {
  store?: () => RootStore
  relationNames?: string[] = ['books']
  id: string
  typename: string
  name?: string = null
  books_id?: string[] = []
  get books(): BookModel[] | undefined {
    return this.books_id.map((id) => this.store().books.get(id))
  }
  set books(books) {
    this.books_id = books.map((m) => m.id)
  }

  constructor(store: () => RootStore, data: any) {
    this.store = store
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

    makeObservable(this, {
      update: action,
      name: observable,
      books_id: observable,
      books: computed,
    })
  }

  update(snapshot: BookTagFields) {
    const keys = Object.keys(snapshot)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (knownBookTagProperties.includes(key)) {
        this[key] = snapshot[key]
      }
    }
  }
}
