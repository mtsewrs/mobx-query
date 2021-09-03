import { RootStoreBase, Snapshot } from './base/root.base'
import { StoreOptions } from '<%- props.test ? '../../lib' : 'mobx-query' %>'

export class RootStore extends RootStoreBase {
  constructor(options: StoreOptions, data?: Snapshot) {
    super(options, data)
  }
}