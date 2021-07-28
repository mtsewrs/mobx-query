/* This is a mobx-query generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { observable, makeObservable } from 'mobx'
import {
  MQStore,
  QueryOptions,
  StoreOptions,
  setTypes,
  getCollectionName,
} from '../../../lib'
import { UserModel, UserData, UserType } from '../UserModel'
import { BookModel, BookData, BookType } from '../BookModel'
import { BookTagModel, BookTagData, BookTagType } from '../BookTagModel'
import { PublisherModel, PublisherData, PublisherType } from '../PublisherModel'

const knownTypes: any = [
  ['User', () => UserModel],
  ['Book', () => BookModel],
  ['BookTag', () => BookTagModel],
  ['Publisher', () => PublisherModel],
]
const rootTypes = ['User', 'Book', 'BookTag', 'Publisher']
export interface Data {
  users?: {
    [key: string]: {
      [key in keyof UserData]: UserData[key]
    }
  }
  books?: {
    [key: string]: {
      [key in keyof BookData]: BookData[key]
    }
  }
  booktags?: {
    [key: string]: {
      [key in keyof BookTagData]: BookTagData[key]
    }
  }
  publishers?: {
    [key: string]: {
      [key in keyof PublisherData]: PublisherData[key]
    }
  }
}

export interface Snapshot extends Data {
  __queryCacheData?: Map<string, any>
}

export class RootStoreBase extends MQStore {
  users = observable.map<string, UserType>()
  books = observable.map<string, BookType>()
  booktags = observable.map<string, BookTagType>()
  publishers = observable.map<string, PublisherType>()
  kt: Map<any, any>
  rt: Set<any>

  constructor(options: StoreOptions, data: Snapshot) {
    super(options, data)
    makeObservable(this, {
      users: observable,
      books: observable,
      booktags: observable,
      publishers: observable,
    })

    const kt = new Map()
    const rt = new Set(rootTypes)

    setTypes(this, kt, knownTypes, data)

    this.kt = kt
    this.rt = rt
  }

  getSnapshot(): Snapshot {
    const snapshot = {}
    for (let i = 0; i < rootTypes.length; i++) {
      const collection = getCollectionName(rootTypes[i])
      const obj = Object.fromEntries(this[collection])
      snapshot[collection] = obj
    }

    snapshot['__queryCacheData'] = this.__queryCacheData

    return snapshot
  }

  queryViewer(variables?: {}, options: QueryOptions = {}) {
    return this.query<UserType>('user', 'viewer', variables, options)
  }
  queryGetUser(variables: { id: string }, options: QueryOptions = {}) {
    return this.query<UserType>('user', 'getUser', variables, options)
  }
  queryGetUsers(variables?: {}, options: QueryOptions = {}) {
    return this.query<{ users: UserType[] }>(
      'user',
      'getUsers',
      variables,
      options
    )
  }
  queryCreateUser(
    variables: { password: string; email: string },
    options: QueryOptions = {}
  ) {
    return this.query<UserType>('user', 'createUser', variables, options)
  }
  queryLogin(
    variables: { password: string; email: string },
    options: QueryOptions = {}
  ) {
    return this.query<UserType>('user', 'login', variables, options)
  }

  isKnownType(typename: string): boolean {
    return this.kt.has(typename)
  }
  isRootType(typename: string): boolean {
    return this.rt.has(typename)
  }
  getTypeDef(typename: string): any {
    return this.kt.get(typename)!
  }
}
