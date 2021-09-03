const known<%= props.model.name %>Properties = ['id', 'typename', <% props.model.properties.forEach(function(model) { %> '<%= model.name %>', <% }) %>]
export type <%= props.model.name %>ModelBaseType = Omit<<%= props.model.name %>ModelBase, 'update' | 'store' | 'relationNames' | '<%= props.model.relationNames[0] %>' <% props.model.relationNames.forEach(function(model, i) { %>
<%_ if(i !== 0) { _%>
 | '<%= model %>'
<%_ } _%>
<% }) %>>

export interface <%= props.model.name %>Fields {
<%_ for(var i=0; i < props.model.properties.length; i++) { _%>
<%_ if(props.model.properties[i].ref_type !== "ref" && props.model.properties[i].ref_type !== "ref[]") { _%>
<%= props.model.properties[i].name %>?: <%= props.model.properties[i].type %>
<%_ } _%>
<%_ } _%>
}

export class <%= props.model.name %>ModelBase {
  store?: () => RootStore
 relationNames?: string[] = [<% props.model.relationNames.forEach(function(model) { %> '<%= model %>', <% }) %>]
 id: string
 typename: string
<%_ for(var i=0; i < props.model.properties.length; i++) { _%>
<%_ switch (props.model.properties[i].ref_type) {
case 'ref' : _%>
    <%= props.model.properties[i].name %>_id?: string = null
    get <%= props.model.properties[i].name %>(): <%= props.model.properties[i].type %>Model | undefined {
      return this.store().<%= props.plural(props.model.properties[i].type.toLowerCase()) %>.get(this.<%= props.model.properties[i].name %>_id)
    }
    set <%= props.model.properties[i].name %>(<%= props.model.properties[i].name %>) {
      this.<%= props.model.properties[i].name %>_id = <%= props.model.properties[i].name %>.id
    }
    <% break;
case 'ref[]' : _%>
    <%= props.model.properties[i].name %>_id?: string[] = []
    get <%= props.model.properties[i].name %>(): <%= props.model.properties[i].type %>Model[] | undefined {
      return this.<%= props.model.properties[i].name %>_id.map( id => this.store().<%= props.plural(props.model.properties[i].type.toLowerCase()) %>.get(id))
    }
    set <%= props.model.properties[i].name %>(<%= props.model.properties[i].name %>) {
      this.<%= props.model.properties[i].name %>_id = <%= props.model.properties[i].name %>.map(m => m.id)
    }
    <% break;
default: _%>
    <%= props.model.properties[i].name %>?: <%= props.model.properties[i].type %> = null
    <% break;
} _%>
<%_ } _%>

  constructor(store: () => RootStore, data: any) {
    this.store = store
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const fieldData = data[key]
      if (this.relationNames.includes(key)) {
        const relationKey = key + '_id'
        if (Array.isArray(this[relationKey])) {
          for (let i = 0; i < data[key].length; i++) {
            const element = data[key][i]
            this[relationKey].push(element.id)
          }
        } else {
          this[relationKey] = fieldData.id
        }
      } else {
        if(known<%= props.model.name %>Properties.includes(key)) {
          this[key] = fieldData
        }
      }
    }

    makeObservable(this, {
      update: action,
      <%_ for(var i=0; i < props.model.properties.length; i++) { _%>
        <%_ if (props.model.properties[i].ref_type === 'ref' || props.model.properties[i].ref_type === 'ref[]') { _%>
          <%= props.model.properties[i].name %>_id: observable,
          <%= props.model.properties[i].name %>: computed,
        <%_ } else { _%>
          <%= props.model.properties[i].name %>: observable,
        <%_ } _%>
      <%_ } _%>
    })
  }

  update(snapshot: <%= props.model.name %>Fields) {
    const keys = Object.keys(snapshot)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (known<%= props.model.name %>Properties.includes(key)) {
        this[key] = snapshot[key]
      }
    }
  }
}