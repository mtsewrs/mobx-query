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
 getUsers UsersReturn
 viewer User
 viewers User[]
 logout boolean
 login(username string, password string) User
 update(email string) User
}

interface UsersReturn {
  users User[]
}

enum Role {
  USER,
  ADMIN,
  SUPERUSER
}
```

## Scaffold

```
yarn mobx-query scaffold --out src/models
```

## Usage

```typescript
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
  return <div>...data</div>
}

export default observer(Home)
```

For now see react test in test folder for usage, example will come soon
