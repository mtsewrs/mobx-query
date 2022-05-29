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
const rootTypes = knownTypes.map((arr) => arr[0])

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

interface QueryInterface {
  user:
    | {
        name: 'getUsers'
        variables: unknown

        returnType: users_return
      }
    | {
        name: 'getUser'
        variables: unknown

        returnType: user_return
      }
    | {
        name: 'viewer'
        variables: unknown

        returnType: UserModel
      }
    | {
        name: 'viewers'
        variables: unknown

        returnType: UserModel[]
      }
    | {
        name: 'logout'
        variables: unknown

        returnType: boolean
      }
    | {
        name: 'login'
        variables: {
          username: string

          password: string
        }
        returnType: UserModel
      }
    | {
        name: 'update'
        variables: {
          email: string
        }
        returnType: UserModel
      }
}

type namespace = keyof QueryInterface

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
    setTypes(this, kt, knownTypes, data)
    this.kt = kt
  }

  query<
    Name extends QueryInterface[namespace]['name'],
    Variables extends Extract<
      QueryInterface[namespace],
      { name: Name }
    > extends {
      variables: infer TVariables
    }
      ? TVariables
      : unknown,
    ReturnType extends Extract<
      QueryInterface[namespace],
      { name: Name }
    > extends {
      returnType: infer ReturnType
    }
      ? ReturnType
      : unknown
  >(
    path: namespace,
    action: Name,
    variables?: Variables,
    options: QueryOptions = {}
  ) {
    return this.rawQuery<ReturnType>(path, action, variables, options)
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
  getTypeDef(typename: string): any {
    return this.kt.get(typename)!
  }
}
