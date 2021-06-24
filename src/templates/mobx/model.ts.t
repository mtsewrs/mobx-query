import { <%= props.model.name %>ModelBase } from './base/<%= props.model.name %>Model.base'
import { RootStoreBase, Data } from './base/root.base'

export type <%= props.model.name %>Type = <%= props.model.name %>Model

export type <%= props.model.name %>Data = Omit<<%= props.model.name %>Type, 'update' | '<%= props.model.relationNames[0] %>' <% props.model.relationNames.forEach(function(model, i) { %>
<%_ if(i !== 0) { _%>
 | '<%= model %>'
<%_ } _%>
<% }) %>>

export class <%= props.model.name %>Model extends <%= props.model.name %>ModelBase {
  constructor(store: RootStoreBase, data: Data) {
    super(store, data)
  }
}