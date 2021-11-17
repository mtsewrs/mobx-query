# Mobx Query

**DO NOT USE, NOT STABLE**

Generates typescript mobx models and query client for your json rpc api

> In order for it to work your data fetched from the server must return "typename" and "id" property for the corresponding model

## Installation

```bash
yarn add mobx-query mobx mobx-react-lite react react-dom
```

## Schema file

mobx-query requires a schema file called `schema.query`. Example schema

```
model User {
  created_at    string
  updated_at    string
  name          string
  email         string
  password      string
  role          Role
  books         Book @ref[]
  friend        User @ref
  favouriteBook Book @ref
}

model Book {
  title              string
  author             User @ref
  publisher          Publisher @ref
  tags               BookTag @ref[]
  metaArrayOfStrings any
}

model BookTag {
  name  string
  books Book @ref[]
}

model Publisher {
  name  string
  books Book @ref[]
}

action user {
 getUsers users
 viewer User
 viewers User[]
 logout boolean
 login(username string, password string) User
 update(email string) User
}

interface users {
  users User[]
}

enum Role {
  USER,
  ADMIN,
  SUPERUSER
}
```

## CLI Scaffold

params:
--out - output folder, defaults to "src/models" from project root
--force - will delete everything from output folder, defaults to `false`

### Example

```
yarn mobx-query scaffold --out src/models
```

## Generated mobx models

The base models gets put into the same file called `[output]/base/model.base.ts`, this file should not be modified since it will be
deleted when you run the scaffold command again

For example the `User` model will look like this when scaffolded(shortend):

```typescript
export class UserModelBase {
  store?: () => RootStore
  relationNames?: string[] = ['books', 'friend', 'favouriteBook']
  id: string
  typename: string
  created_at?: string = null
  updated_at?: string = null
  name?: string = null
  email?: string = null
  password?: string = null
  role?: Role = null
  books_id?: string[] = []
  get books(): BookModel[] | undefined {
    return this.books_id.map((id) => this.store().books.get(id))
  }
  set books(books) {
    this.books_id = books.map((m) => m.id)
  }
  friend_id?: string = null
  get friend(): UserModel | undefined {
    return this.store().users.get(this.friend_id)
  }
  set friend(friend) {
    this.friend_id = friend.id
  }
  favouriteBook_id?: string = null
  get favouriteBook(): BookModel | undefined {
    return this.store().books.get(this.favouriteBook_id)
  }
  set favouriteBook(favouriteBook) {
    this.favouriteBook_id = favouriteBook.id
  }

  constructor(store: () => RootStore, data: any) {
    this.store = store
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const fieldData = data[key]
      if (this.relationNames.includes(key)) {
        const relationKey = key + '_id'
        if (Array.isArray(this[relationKey])) {
          for (let i = 0; i < data[key].length; i++) {
            const element = data[key][i]
            this[relationKey].push(element.id)
          }
        } else {
          this[relationKey] = fieldData.id
        }
      } else {
        if (knownUserProperties.includes(key)) {
          this[key] = fieldData
        }
      }
    }

    makeObservable(this, {
      update: action,
      created_at: observable,
      updated_at: observable,
      name: observable,
      email: observable,
      password: observable,
      role: observable,
      books_id: observable,
      books: computed,
      friend_id: observable,
      friend: computed,
      favouriteBook_id: observable,
      favouriteBook: computed,
    })
  }

  update(snapshot: UserFields) {
    const keys = Object.keys(snapshot)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (knownUserProperties.includes(key)) {
        this[key] = snapshot[key]
      }
    }
  }
}
```

Another file called `[output]/UserModel.ts` will also me generated but only once and would look like:

```typescript
import { Data } from './base/root.base'
import { RootStore } from './root'
import { UserModelBase, UserModelBaseType } from './base/model.base'

export type UserData = UserModelBaseType

export class UserModel extends UserModelBase {
  constructor(store: () => RootStore, data: Data) {
    super(store, data)
  }
}
```

This file can safely be modified to extend its functionability

Using the example schema a root class will also be generated called `[output]/base/root.base.ts`(shortend):

```typescript
export class RootStoreBase extends MQStore {
  users = observable.map<string, UserModel>()
  books = observable.map<string, BookModel>()
  booktags = observable.map<string, BookTagModel>()
  publishers = observable.map<string, PublisherModel>()
  kt: Map<any, any>
  rt: Set<any>

  constructor(options: StoreOptions, data: Snapshot) {
    super(options, data)
    makeObservable(this, {
      users: observable,
      books: observable,
      booktags: observable,
      publishers: observable,
    })

    const kt = new Map()

    setTypes(this, kt, knownTypes, data)

    this.kt = kt
  }

  query<
    T extends keyof QueryReturn,
    R extends ActionName<T>,
    V extends VariableName<T>
  >(
    path: T,
    action: V | R,
    variables?: QueryVariables[T][V],
    options: QueryOptions = {}
  ) {
    return this.rawQuery<QueryReturn[T][R]>(
      path,
      action as string,
      variables,
      options
    )
  }

  getSnapshot(): Snapshot {
    const snapshot = {}
    for (let i = 0; i < rootTypes.length; i++) {
      const collection = getCollectionName(rootTypes[i])
      const obj = Object.fromEntries(this[collection])
      snapshot[collection] = obj
    }

    snapshot['__queryCacheData'] = this.__queryCacheData

    return snapshot
  }

  isKnownType(typename: string): boolean {
    return this.kt.has(typename)
  }
  getTypeDef(typename: string): any {
    return this.kt.get(typename)!
  }
}
```

with a corresponding root file called `[output]/root.ts`

```typescript
import { RootStoreBase, Snapshot } from './base/root.base'
import { StoreOptions } from '../../lib'

export class RootStore extends RootStoreBase {
  constructor(options: StoreOptions, data?: Snapshot) {
    super(options, data)
  }
}
```

which can also be extended

## Query usage

```typescript
import { useQuery, RootStore, StoreContext } from './models'

const url = 'http://example.com/api/'

const store = new RootStore(
  {
    // send the request however you want, example using fetch
    request: async (path: string, method: string, params: object) => {
      const r = await fetch(url + path, {
        method: 'POST',
        body: JSON.stringify({
          method,
          params,
        }),
      })
      if (!r.ok) {
        const resp = await r.json()
        throw new Error(resp.message)
      }
      return await r.json()
    },
  },
  data // inital data
)

function App() {
  return (
    <StoreContext.Provider value={store}>
      <Home />
    </StoreContext.Provider>
  )
}

function Home() {
  const { data, loading, error } = useQuery((store) =>
    store.query('user', 'getUsers', {})
  )

  if (loading) {
    return 'Loading...'
  }

  if (error) {
    return 'Error'
  }
  return <div>{data}</div>
}
```
