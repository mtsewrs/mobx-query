import { ObservableMap } from 'mobx'
import { types } from 'mobx-state-tree'
import {
  MSTGQLStore,
  configureStoreMixin,
  QueryOptions,
  withTypedRefs
} from '../../../../lib/mst'
import { UserModel, UserType } from '../UserModel'
import { BookModel, BookType } from '../BookModel'
import { BookTagModel, BookTagType } from '../BookTagModel'
import { PublisherModel, PublisherType } from '../PublisherModel'

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  users: ObservableMap<string, UserType>
  books: ObservableMap<string, BookType>
  booktags: ObservableMap<string, BookTagType>
  publishers: ObservableMap<string, PublisherType>
}

export const RootStoreBase = withTypedRefs<Refs>()(
  MSTGQLStore.named('RootStore')
    .extend(
      configureStoreMixin(
        [
          ['User', () => UserModel],
          ['Book', () => BookModel],
          ['BookTag', () => BookTagModel],
          ['Publisher', () => PublisherModel]
        ],
        ['User', 'Book', 'BookTag', 'Publisher']
      )
    )
    .props({
      users: types.optional(types.map(types.late((): any => UserModel)), {}),
      books: types.optional(types.map(types.late((): any => BookModel)), {}),
      booktags: types.optional(
        types.map(types.late((): any => BookTagModel)),
        {}
      ),
      publishers: types.optional(
        types.map(types.late((): any => PublisherModel)),
        {}
      )
    })
    .actions(self => ({
      queryViewer(variables?: {}, options: QueryOptions = {}) {
        return self.query<UserType>('user', 'viewer', variables, options)
      },
      queryGetUser(variables: { id: string }, options: QueryOptions = {}) {
        return self.query<UserType>('user', 'getUser', variables, options)
      },
      queryGetUsers(variables?: {}, options: QueryOptions = {}) {
        return self.query<{ users: UserType[] }>(
          'user',
          'getUsers',
          variables,
          options
        )
      },
      mutateCreateUser(
        variables: { password: string; email: string },
        optimisticUpdate?: (store: Refs) => void
      ) {
        return self.mutate<UserType>(
          'user',
          'createUser',
          variables,
          optimisticUpdate
        )
      },
      mutateLogin(
        variables: { password: string; email: string },
        optimisticUpdate?: (store: Refs) => void
      ) {
        return self.mutate<UserType>(
          'user',
          'login',
          variables,
          optimisticUpdate
        )
      }
    }))
)
