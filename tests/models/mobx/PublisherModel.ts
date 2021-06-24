import { PublisherModelBase } from './base/PublisherModel.base'

export type PublisherType = PublisherModel

export type PublisherData = Omit<PublisherType, 'update' | 'books'>

export class PublisherModel extends PublisherModelBase {
  constructor(store: any, data: any) {
    super(store, data)
  }
}
