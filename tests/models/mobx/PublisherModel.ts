import { PublisherModelBase } from './base/PublisherModel.base'
import { RootStoreBase, Data } from './base/root.base'

export type PublisherType = PublisherModel

export type PublisherData = Omit<PublisherType, 'update' | 'books' 
>

export class PublisherModel extends PublisherModelBase {
  constructor(store: RootStoreBase, data: Data) {
    super(store, data)
  }
}