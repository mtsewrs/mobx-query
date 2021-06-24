/* This is a mobx-query generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from 'mobx-state-tree'
import { MSTGQLRef } from '../../../../lib/mst'

import { ModelBase } from '../common/ModelBase'
import { RootStoreType } from '../common/root'

import { UserModel } from '../UserModel'
import { PublisherModel } from '../PublisherModel'
import { BookTagModel } from '../BookTagModel'

export const BookModelBase = ModelBase.named('Book')
  .props({
    typename: types.union(types.undefined, types.null, types.string),
    id: types.identifier,
    title: types.union(types.undefined, types.null, types.string),
    author: types.union(
      types.undefined,
      types.null,
      MSTGQLRef(types.late((): any => UserModel))
    ),
    publisher: types.union(
      types.undefined,
      types.null,
      MSTGQLRef(types.late((): any => PublisherModel))
    ),
    tags: types.union(
      types.undefined,
      types.null,
      types.array(
        types.union(types.null, MSTGQLRef(types.late((): any => BookTagModel)))
      )
    )
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))
  .volatile(() => ({
    metaArrayOfStrings: null
  }))
