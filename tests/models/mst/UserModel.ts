import { Instance } from 'mobx-state-tree'
import { UserModelBase } from './base/UserModel.base'

export interface UserType extends Instance<typeof UserModel> {}

export const UserModel = UserModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self))
  }
}))
