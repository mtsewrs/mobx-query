/* This is a mobx-query generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from 'mobx-state-tree'
<%_ if(!!props.model.relations.length) { _%>
import { MSTGQLRef } from '<%- props.test ? '../../../../lib/mst' : 'mobx-query/mst' %>'
<%_ } _%>

import { ModelBase } from '../common/ModelBase'
import { RootStoreType } from '../common/root'

<%_ for(var i=0; i < props.model.relations.length; i++) { _%>
import { <%= props.model.relations[i] %>Model } from '../<%= props.model.relations[i] %>Model'
<%_ } _%>

export const <%= props.model.name %>ModelBase = ModelBase
  .named('<%= props.model.name %>')
  .props({
<%_ for(var i=0; i < props.model.types.length; i++) { _%>
<%_ switch (props.model.types[i].type) {
case 'typename' : _%>
    typename: types.optional(types.literal('<%= props.model.name %>'), '<%= props.model.name %>'),
    <% break;
case 'string' : _%>
    <%= props.model.types[i].name %>: types.union(types.undefined, types.null, types.string),
    <% break;
case 'int' : _%>
    <%= props.model.types[i].name %>: types.union(types.undefined, types.null, types.integer),
    <% break;
case 'boolean' : _%>
    <%= props.model.types[i].name %>: types.union(types.undefined, types.null, types.boolean),
    <% break;
case 'id' : _%>
    	id: types.identifier,
    <% break;
case 'ref' : _%>
    <%= props.model.types[i].name %>: types.union(types.undefined, types.null, MSTGQLRef(types.late((): any => <%= props.model.types[i].ref %>Model))),
    <% break;
case 'ref[]' : _%>
    <%= props.model.types[i].name %>: types.union(types.undefined, types.null, types.array(types.union(types.null, MSTGQLRef(types.late((): any => <%= props.model.types[i].ref %>Model))))),
    <% break;
case 'string[]' : _%>
    <%= props.model.types[i].name %>: types.union(types.undefined, types.null, types.array(types.union(types.null, types.string))),
    <% break;
case 'int[]' : _%>
    <%= props.model.types[i].name %>: types.union(types.undefined, types.null, types.array(types.union(types.null, types.number))),
    <% break;
} _%>
<%_ } _%>
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))
<%_ if(props.model.hasJson) { _%>
  .volatile(() => ({
<%_ for(var i=0; i < props.model.types.length; i++) { _%>
<%_ switch (props.model.types[i].type) {
case 'json' : _%>
    <%= props.model.types[i].name %>: null,
    <% break;
} _%>
<%_ } _%>
  }))
<%_ } _%>