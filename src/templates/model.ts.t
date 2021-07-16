import { RootStoreBase, Data } from './base/root.base'
import { <%= props.model.name %>ModelBase, <%= props.model.name %>ModelBaseType } from './base/model.base'

export type <%= props.model.name %>Type = <%= props.model.name %>Model

export type <%= props.model.name %>Data = <%= props.model.name %>ModelBaseType

export class <%= props.model.name %>Model extends <%= props.model.name %>ModelBase {
  constructor(getStore: () => RootStoreBase, data: Data) {
    super(getStore, data)
  }
}