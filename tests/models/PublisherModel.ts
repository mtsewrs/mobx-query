import { RootStoreBase, Data } from './base/root.base'
import { PublisherModelBase, PublisherModelBaseType } from './base/model.base'

export type PublisherType = PublisherModel

export type PublisherData = PublisherModelBaseType

export class PublisherModel extends PublisherModelBase {
  constructor(getStore: () => RootStoreBase, data: Data) {
    super(getStore, data)
  }
}
