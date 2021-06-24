/* This is a mobx-query generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { makeObservable, observable, computed, action } from 'mobx'
import { RootStoreBase } from './root.base'
import { UserType } from '../UserModel'
import { PublisherType } from '../PublisherModel'
import { BookTagType } from '../BookTagModel'

const knownProperties = [
  'typename',
  'id',
  'title',
  'author',
  'publisher',
  'tags',
  'metaArrayOfStrings'
]

export class BookModelBase {
  store?: RootStoreBase
  relationNames?: string[] = ['author', 'publisher', 'tags']
  typename?: string = null
  id: string
  title?: string = null
  author_id?: string = null
  get author(): UserType | undefined {
    return this.store.users.get(this.author_id)
  }
  publisher_id?: string = null
  get publisher(): PublisherType | undefined {
    return this.store.publishers.get(this.publisher_id)
  }
  tags_id?: string[] = []
  get tags(): BookTagType[] | undefined {
    return this.tags_id.map(id => this.store.booktags.get(id))
  }
  metaArrayOfStrings?: any = null

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
      title: observable,
      author_id: observable,
      author: computed,
      publisher_id: observable,
      publisher: computed,
      tags_id: observable,
      tags: computed,
      metaArrayOfStrings: observable
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
