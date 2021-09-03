import { Data } from './base/root.base'
import { RootStore } from './root';
import { <%= props.model.name %>ModelBase, <%= props.model.name %>ModelBaseType } from './base/model.base'

export type <%= props.model.name %>Data = <%= props.model.name %>ModelBaseType

export class <%= props.model.name %>Model extends <%= props.model.name %>ModelBase {
  constructor(store: () => RootStore, data: Data) {
    super(store, data)
  }
}