/* This is a mobx-query generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { observable, makeObservable } from 'mobx'
import { MQStore, QueryOptions, StoreOptions, setTypes, getCollectionName } from '<%- props.test ? '../../../../lib/mobx' : 'mobx-query/mobx' %>'
<%_ for(var i=0; i < props.models.length; i++) { _%>
import { <%= props.models[i] %>Model, <%= props.models[i] %>Data, <%= props.models[i] %>Type } from '../<%= props.models[i] %>Model'
<%_ } _%>

const knownTypes: any = [<% props.models.forEach(function(model) { %> ['<%= model %>', () => <%= model %>Model], <% }); %>]
const rootTypes = [<% props.models.forEach(function(model) { %> '<%= model %>', <% }); %>]
export interface Data {
  <%_ for(var i=0; i < props.models.length; i++) { _%>
    <%= props.plural(props.models[i].toLowerCase()) %>?: {
      [key: string]: {
        [key in keyof <%= props.models[i] %>Data]: <%= props.models[i] %>Data[key]
      }
    }
  <%_ } _%>
}

export class RootStoreBase extends MQStore {
<%_ for(var i=0; i < props.models.length; i++) { _%>
    <%= props.plural(props.models[i].toLowerCase()) %> = observable.map<string, <%= props.models[i] %>Type>()
<%_ } _%>
  kt: Map<any, any>
  rt: Set<any>

  constructor(options: StoreOptions, data: Data) {
    super(options)
    makeObservable(this, {
  <%_ for(var i=0; i < props.models.length; i++) { _%>
    <%= props.plural(props.models[i].toLowerCase()) %>: observable,
  <%_ } _%>
    })

    const kt = new Map()
    const rt = new Set(rootTypes)

    setTypes(this, kt, knownTypes, data)

    this.kt = kt
    this.rt = rt
  }

  getSnapshot() {
    const snapshot = {}
    for (let i = 0; i < rootTypes.length; i++) {
      const collection = getCollectionName(rootTypes[i])
      const obj = Object.fromEntries(this[collection])
      snapshot[collection] = obj
    }

    return snapshot
  }

<%_ for(var i=0; i < props.actions.length; i++) { _%>
    <%_ var action = props.schema.actions.get(props.actions[i]); _%>
    <%_ var required = false; _%>
    <%_
      action.args.forEach(arg => {
        if(arg.required) {
          required = true
        }
      });
    _%>
    <%= action.type %><%= props.upperFirst(props.actions[i]) %>(variables<%- !action.args.length ? '?' : '' %>: {<% action.args.length && action.args.forEach(function(arg) { %> <%= arg.name %><% arg.required && '?' %>: <%= arg.type %>, <% }); %>}, <%- action.type == 'query' ? 'options: QueryOptions = {}' : 'optimisticUpdate?: (store: RootStoreBase) => void'  %>) {
      return this.<%= action.type %><<%= action.returnType %>>('<%= action.path %>', '<%= props.actions[i] %>', variables, <%- action.type == 'query' ? 'options' : 'optimisticUpdate'  %>)
    }
<%_ } _%>

  isKnownType(typename: string): boolean {
    return this.kt.has(typename)
  }
  isRootType(typename: string): boolean {
    return this.rt.has(typename)
  }
  getTypeDef(typename: string): any {
    return this.kt.get(typename)!
  }
}