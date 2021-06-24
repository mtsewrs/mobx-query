import { ObservableMap } from 'mobx'
import { types } from 'mobx-state-tree'
import { MSTGQLStore, configureStoreMixin, QueryOptions, withTypedRefs } from '<%- props.test ? '../../../../lib/mst' : 'mobx-query/mst' %>'
<%_ for(var i=0; i < props.models.length; i++) { _%>
import { <%= props.models[i] %>Model, <%= props.models[i] %>Type } from '../<%= props.models[i] %>Model'
<%_ } _%>

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
<%_ for(var i=0; i < props.models.length; i++) { _%>
  <%= props.plural(props.models[i].toLowerCase()) %>: ObservableMap<string, <%= props.models[i] %>Type>,
<%_ } _%>
}

export const RootStoreBase = withTypedRefs<Refs>()(MSTGQLStore
  .named('RootStore')
  .extend(configureStoreMixin([<% props.models.forEach(function(model) { %> ['<%= model %>', () => <%= model %>Model], <% }); %>], [<% props.models.forEach(function(model) { %> '<%= model %>', <% }); %>]))
  .props({
<%_ for(var i=0; i < props.models.length; i++) { _%>
    <%= props.plural(props.models[i].toLowerCase()) %>: types.optional(types.map(types.late((): any => <%= props.models[i] %>Model)), {}),
<%_ } _%>
  })
  .actions(self => ({
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
    <%= action.type %><%= props.upperFirst(props.actions[i]) %>(variables<%- !action.args.length ? '?' : '' %>: {<% action.args.length && action.args.forEach(function(arg) { %> <%= arg.name %><% arg.required && '?' %>: <%= arg.type %>, <% }); %>}, <%- action.type == 'query' ? 'options: QueryOptions = {}' : 'optimisticUpdate?: (store: Refs) => void'  %>) {
      return self.<%= action.type %><<%= action.returnType %>>('<%= action.path %>', '<%= props.actions[i] %>', variables, <%- action.type == 'query' ? 'options' : 'optimisticUpdate'  %>)
    },
<%_ } _%>
  })))