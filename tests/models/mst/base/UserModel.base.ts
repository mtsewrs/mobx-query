/* This is a mobx-query generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from 'mobx-state-tree'
import { MSTGQLRef } from '../../../../lib/mst'

import { ModelBase } from '../common/ModelBase'
import { RootStoreType } from '../common/root'

import { BookModel } from '../BookModel'
import { UserModel } from '../UserModel'

export const UserModelBase = ModelBase.named('User')
  .props({
    typename: types.union(types.undefined, types.null, types.string),
    id: types.identifier,
    created_at: types.union(types.undefined, types.null, types.string),
    name: types.union(types.undefined, types.null, types.string),
    email: types.union(types.undefined, types.null, types.string),
    password: types.union(types.undefined, types.null, types.string),
    books: types.union(
      types.undefined,
      types.null,
      types.array(
        types.union(types.null, MSTGQLRef(types.late((): any => BookModel)))
      )
    ),
    friend: types.union(
      types.undefined,
      types.null,
      MSTGQLRef(types.late((): any => UserModel))
    ),
    favouriteBook: types.union(
      types.undefined,
      types.null,
      MSTGQLRef(types.late((): any => BookModel))
    )
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))
