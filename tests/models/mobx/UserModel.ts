import { UserModelBase } from './base/UserModel.base'
import { RootStoreBase, Data } from './base/root.base'

export type UserType = UserModel

export type UserData = Omit<UserType, 'update' | 'books' 

 | 'friend'

 | 'favouriteBook'
>

export class UserModel extends UserModelBase {
  constructor(store: RootStoreBase, data: Data) {
    super(store, data)
  }
}