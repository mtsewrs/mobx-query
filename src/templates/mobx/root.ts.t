import { RootStoreBase, Data } from '../base/root.base'
import { StoreOptions } from '<%- props.test ? '../../../../lib/mobx' : 'mobx-query/mobx' %>'

export class RootStore extends RootStoreBase {
  constructor(options: StoreOptions, data?: Data) {
    super(options, data)
  }
}