/* This is a mobx-query generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { makeObservable, observable, computed, action } from 'mobx'
import { RootStoreBase } from './root.base'
<%_ for(var i=0; i < props.model.relations.length; i++) { _%>
import { <%= props.model.relations[i] %>Type } from '../<%= props.model.relations[i] %>Model'
<%_ } _%>

const knownProperties = [<% props.model.types.forEach(function(model) { %> '<%= model.name %>', <% }) %>]

export class <%= props.model.name %>ModelBase {
  store?: RootStoreBase
 relationNames?: string[] = [<% props.model.relationNames.forEach(function(model) { %> '<%= model %>', <% }) %>]
<%_ for(var i=0; i < props.model.types.length; i++) { _%>
<%_ switch (props.model.types[i].type) {
case 'string' : _%>
    <%= props.model.types[i].name %>?: string = null
    <% break;
case 'int' : _%>
    <%= props.model.types[i].name %>?: integer = null
    <% break;
case 'boolean' : _%>
    <%= props.model.types[i].name %>?: boolean = null
    <% break;
case 'date' : _%>
    <%= props.model.types[i].name %>?: Date = null
    <% break;
case 'json' : _%>
    <%= props.model.types[i].name %>?: any = null
    <% break;
case 'id' : _%>
    	id: string
    <% break;
case 'ref' : _%>
    <%= props.model.types[i].name %>_id?: string = null
    get <%= props.model.types[i].name %>(): <%= props.model.types[i].ref %>Type | undefined {
      return this.store.<%= props.plural(props.model.types[i].ref.toLowerCase()) %>.get(this.<%= props.model.types[i].name %>_id)
    }
    <% break;
case 'ref[]' : _%>
    <%= props.model.types[i].name %>_id?: string[] = []
    get <%= props.model.types[i].name %>(): <%= props.model.types[i].ref %>Type[] | undefined {
      return this.<%= props.model.types[i].name %>_id.map( id => this.store.<%= props.plural(props.model.types[i].ref.toLowerCase()) %>.get(id))
    }
    <% break;
case 'string[]' : _%>
    <%= props.model.types[i].name %>: string[] = null
    <% break;
case 'int[]' : _%>
    <%= props.model.types[i].name %>: integer[] = null
    <% break;
} _%>
<%_ } _%>

  constructor(store: RootStoreBase, data: any) {
    this.store = store
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const fieldData = data[key]
      if (this.relationNames.includes(key)) {
        const relationKey = key + '_id'
        if (this[relationKey] && this[relationKey].length) {
          const ids = []
          for (let i = 0; i < this[relationKey].length; i++) {
            const element = this[relationKey][i]
            ids.push(element.id)
          }
          this[relationKey] = ids
        } else {
          this[relationKey] = fieldData.id
        }
      } else {
        if(knownProperties.includes(key)) {
          this[key] = fieldData
        }
      }
    }

    this.typename = this.constructor.name

    makeObservable(this, {
      store: observable,
      update: action,
      <%_ for(var i=0; i < props.model.types.length; i++) { _%>
        <%_ if (props.model.types[i].type === 'ref' || props.model.types[i].type === 'ref[]') { _%>
          <%= props.model.types[i].name %>_id: observable,
          <%= props.model.types[i].name %>: computed,
        <%_ } else { _%>
          <%= props.model.types[i].name %>: observable,
        <%_ } _%>
      <%_ } _%>
    })
  }

  update(snapshot = {}) {
    const keys = Object.keys(snapshot)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (knownProperties.includes(key)) {
        this[key] = snapshot[key]
      }
    }
  }
}