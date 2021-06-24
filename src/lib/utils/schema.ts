export const schema = {
  models: new Map(),
  actions: new Map()
}

export type Types =
  | 'int'
  | 'string'
  | 'id'
  | 'boolean'
  | 'ref'
  | 'typename'
  | 'ref[]'
  | 'int[]'
  | 'string[]'
  | 'date'
  | 'json'

export interface Models {
  [key: string]: {
    [key: string]: [Types, string?]
  }
}

export interface Actions {
  [key: string]: {
    [key: string]: {
      returnType: string
      type: 'query' | 'mutation'
      args: {
        [key: string]: {
          type: string
          required: boolean
        }
      }
    }
  }
}

export interface Options {
  lib?: string
  out?: string
  force?: boolean
  actions: Actions
  models: Models
}
