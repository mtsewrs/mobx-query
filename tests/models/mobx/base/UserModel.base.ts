/* This is a mobx-query generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { makeObservable, observable, computed, action } from 'mobx'
import { RootStoreBase } from './root.base'
import { BookType } from '../BookModel'
import { UserType } from '../UserModel'

const knownProperties = [
  'typename',
  'id',
  'created_at',
  'updated_at',
  'name',
  'email',
  'password',
  'books',
  'friend',
  'favouriteBook'
]

export class UserModelBase {
  store?: RootStoreBase
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
    return this.books_id.map(id => this.store.books.get(id))
  }
  friend_id?: string = null
  get friend(): UserType | undefined {
    return this.store.users.get(this.friend_id)
  }
  favouriteBook_id?: string = null
  get favouriteBook(): BookType | undefined {
    return this.store.books.get(this.favouriteBook_id)
  }

  constructor(store: RootStoreBase, data: any) {
    this.store = store
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const fieldData = data[key]
      if (this.relationNames.includes(key)) {
        const relationKey = key + '_id'
        if (this[relationKey] && this[relationKey].length) {
          const ids = []
          for (let i = 0; i < this[relationKey].length; i++) {
            const element = this[relationKey][i]
            ids.push(element.id)
          }
          this[relationKey] = ids
        } else {
          this[relationKey] = fieldData.id
        }
      } else {
        if (knownProperties.includes(key)) {
          this[key] = fieldData
        }
      }
    }

    this.typename = this.constructor.name

    makeObservable(this, {
      store: observable,
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
      favouriteBook: computed
    })
  }

  update(snapshot = {}) {
    const keys = Object.keys(snapshot)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (knownProperties.includes(key)) {
        this[key] = snapshot[key]
      }
    }
  }
}
