import { Data } from './base/root.base'
import { RootStore } from './root'
import { UserModelBase, UserModelBaseType } from './base/model.base'

export type UserData = UserModelBaseType

export class UserModel extends UserModelBase {
  constructor(store: () => RootStore, data: Data) {
    super(store, data)
  }
}
