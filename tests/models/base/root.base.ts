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
import { UserModel, UserData } from '../UserModel'
import { BookModel, BookData } from '../BookModel'
import { BookTagModel, BookTagData } from '../BookTagModel'
import { PublisherModel, PublisherData } from '../PublisherModel'

interface users_return {
  users: UserModel[]
}
interface user_return {
  user: UserModel
}

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

interface QueryReturn {
  user: {
    getUsers: users_return
    getUser: user_return
    viewer: UserModel
    viewers: UserModel[]
    logout: boolean
    login: UserModel
    update: UserModel
  }
}

interface QueryVariables {
  user: {
    getUsers: {}
    getUser: {}
    viewer: {}
    viewers: {}
    logout: {}
    login: { username: string; password: string }
    update: { email: string }
  }
}

type ActionName<T extends keyof QueryReturn> = keyof QueryReturn[T]
type VariableName<T extends keyof QueryVariables> = keyof QueryVariables[T]

export interface Snapshot extends Data {
  __queryCacheData?: Map<string, any>
}

export class RootStoreBase extends MQStore {
  users = observable.map<string, UserModel>()
  books = observable.map<string, BookModel>()
  booktags = observable.map<string, BookTagModel>()
  publishers = observable.map<string, PublisherModel>()
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

  query<
    T extends keyof QueryReturn,
    R extends ActionName<T>,
    V extends VariableName<T>
  >(
    path: T,
    action: V | R,
    variables: QueryVariables[T][V],
    options: QueryOptions = {}
  ) {
    return this.rawQuery<QueryReturn[T][R]>(
      path,
      action as string,
      variables,
      options
    )
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
