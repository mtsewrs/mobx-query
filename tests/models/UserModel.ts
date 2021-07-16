import { RootStoreBase, Data } from './base/root.base'
import { UserModelBase, UserModelBaseType } from './base/model.base'

export type UserType = UserModel

export type UserData = UserModelBaseType

export class UserModel extends UserModelBase {
  constructor(getStore: () => RootStoreBase, data: Data) {
    super(getStore, data)
  }
}
