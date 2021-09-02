import { Data } from './base/root.base'
import { RootStore } from './root'
import { PublisherModelBase, PublisherModelBaseType } from './base/model.base'

export type PublisherData = PublisherModelBaseType

export class PublisherModel extends PublisherModelBase {
  constructor(store: () => RootStore, data: Data) {
    super(store, data)
  }
}
