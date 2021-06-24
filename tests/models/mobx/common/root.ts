import { RootStoreBase, Data } from '../base/root.base'
import { StoreOptions } from '../../../../lib/mobx'

export class RootStore extends RootStoreBase {
  constructor(options: StoreOptions, data?: Data) {
    super(options, data)
  }
}
