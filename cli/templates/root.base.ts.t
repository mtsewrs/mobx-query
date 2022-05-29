/* This is a mobx-query generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { observable, makeObservable } from 'mobx'
import { MQStore, QueryOptions, StoreOptions, setTypes, getCollectionName } from '<%- props.test ? '../../../lib' : 'mobx-query' %>'
<%_ for(var i=0; i < props.models.length; i++) { _%>
import { <%= props.models[i].name %>Model, <%= props.models[i].name %>Data } from '../<%= props.models[i].name %>Model'
<%_ } _%>

<%_ for(var i=0; i < props.config.interfaces.length; i++) { _%>
  <%= props.config.interfaces[i] %>
<%_ } _%>

const knownTypes: any = [<% props.models.forEach(function(model) { %> ['<%= model.name %>', () => <%= model.name %>Model], <% }); %>]
const rootTypes = knownTypes.map(arr => arr[0])

export interface Data {
  <%_ for(var i=0; i < props.models.length; i++) { _%>
    <%= props.plural(props.models[i].name.toLowerCase()) %>?: {
      [key: string]: {
        [key in keyof <%= props.models[i].name %>Data]: <%= props.models[i].name %>Data[key]
      }
    }
  <%_ } _%>
}

interface QueryInterface {
<%_ for(var i=0; i < props.namespaces.length; i++) { _%>
  <%_ var namespace = props.namespaces[i]; _%>
  <%= namespace.namespace %>: 
    <%_ for(var j=0; j < namespace.actions.length; j++) { _%>
      <%_ var action = namespace.actions[j]; _%>
      | { 
          name: '<%= action.name %>',
          variables: <%= !action.variables.length ? 'unknown,' : '{' %><% action.variables.length && action.variables.forEach(function(arg) { %>
            <%= arg.name %>: <%= arg.type %>
          <% }) %>
          <%= action.variables.length && '},' %>
          returnType: <%= action.type %>
      }
  <%_ } _%>
<%_ } _%>
}

type namespace = keyof QueryInterface

export interface Snapshot extends Data {
  __queryCacheData?: Map<string, any>
}

export class RootStoreBase extends MQStore {
<%_ for(var i=0; i < props.models.length; i++) { _%>
    <%= props.plural(props.models[i].name.toLowerCase()) %> = observable.map<string, <%= props.models[i].name %>Model>()
<%_ } _%>
  kt: Map<any, any>
  rt: Set<any>

  constructor(options: StoreOptions, data: Snapshot) {
    super(options, data)
    makeObservable(this, {
  <%_ for(var i=0; i < props.models.length; i++) { _%>
    <%= props.plural(props.models[i].name.toLowerCase()) %>: observable,
  <%_ } _%>
    })

    const kt = new Map()
    setTypes(this, kt, knownTypes, data)
    this.kt = kt
  }

  query<
    Name extends QueryInterface[namespace]['name'],
    Variables extends Extract<
      QueryInterface[namespace],
      { name: Name }
    > extends {
      variables: infer TVariables
    }
      ? TVariables
      : unknown,
    ReturnType extends Extract<
      QueryInterface[namespace],
      { name: Name }
    > extends {
      returnType: infer ReturnType
    }
      ? ReturnType
      : unknown
  >(
    path: namespace,
    action: Name,
    variables?: Variables,
    options: QueryOptions = {}
  ) {
    return this.rawQuery<ReturnType>(
      path,
      action,
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