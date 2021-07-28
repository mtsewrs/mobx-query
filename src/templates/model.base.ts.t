const known<%= props.model.name %>Properties = ['id', 'typename', <% props.model.types.forEach(function(model) { %> '<%= model.name %>', <% }) %>]
export type <%= props.model.name %>ModelBaseType = Omit<<%= props.model.name %>ModelBase, 'update' | 'getStore' | 'relationNames' | '<%= props.model.relationNames[0] %>' <% props.model.relationNames.forEach(function(model, i) { %>
<%_ if(i !== 0) { _%>
 | '<%= model %>'
<%_ } _%>
<% }) %>>

export class <%= props.model.name %>ModelBase {
  getStore?: () => RootStoreBase
 relationNames?: string[] = [<% props.model.relationNames.forEach(function(model) { %> '<%= model %>', <% }) %>]
 id: string
 typename: string
<%_ for(var i=0; i < props.model.types.length; i++) { _%>
<%_ switch (props.model.types[i].type) {
case 'ref' : _%>
    <%= props.model.types[i].name %>_id?: string = null
    get <%= props.model.types[i].name %>(): <%= props.model.types[i].ref %>Type | undefined {
      return this.getStore().<%= props.plural(props.model.types[i].ref.toLowerCase()) %>.get(this.<%= props.model.types[i].name %>_id)
    }
    set <%= props.model.types[i].name %>(<%= props.model.types[i].name %>) {
      this.<%= props.model.types[i].name %>_id = <%= props.model.types[i].name %>.id
    }
    <% break;
case 'ref[]' : _%>
    <%= props.model.types[i].name %>_id?: string[] = []
    get <%= props.model.types[i].name %>(): <%= props.model.types[i].ref %>Type[] | undefined {
      return this.<%= props.model.types[i].name %>_id.map( id => this.getStore().<%= props.plural(props.model.types[i].ref.toLowerCase()) %>.get(id))
    }
    set <%= props.model.types[i].name %>(<%= props.model.types[i].name %>) {
      this.<%= props.model.types[i].name %>_id = <%= props.model.types[i].name %>.map(m => m.id)
    }
    <% break;
default: _%>
    <%= props.model.types[i].name %>?: <%= props.model.types[i].type %> = null
    <% break;
} _%>
<%_ } _%>

  constructor(getStore: () => RootStoreBase, data: any) {
    this.getStore = getStore
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

    this.typename = this.constructor.name

    makeObservable(this, {
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

  update(snapshot: <%= props.model.name %>Type) {
    const keys = Object.keys(snapshot)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (known<%= props.model.name %>Properties.includes(key)) {
        this[key] = snapshot[key]
      }
    }
  }
}