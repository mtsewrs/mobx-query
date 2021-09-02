{{
  function extractModels(models) {
  	let m = []
    for(let i = 0; i < models.length; i++) {
    	const name = models[i][2]
        const properties = models[i][6]
        m.push({
        	name: name,
            properties: properties.map(p => {
            	const name = p[0]
                const type = p[2]
                const ref = p[4]
                const hasRef = ref ? true : false
                return {
                	name,
                  type,
                  ref_type: hasRef ? ref[2] ? 'ref[]' : 'ref' : null
                }
            })
        })
    }
    return m
  }
  
  function extractActions(namespaces) {
  	let a = []
    for(let i = 0; i < namespaces.length; i++) {
    	const namespace = namespaces[i][2]
        const actions = namespaces[i][6]
        a.push({
        	namespace: namespace,
            actions: actions.map(a => {
            	const name = a[0]
              const type = a[4][0]
				      const variables = a[2] ? a[2][1].map(v => ({ name: v[1], type: v[3]})) : false
            	return {
                	name,
                    type,
                    variables
                }
            })
        })
    }
    return a
  }
  
  function extractInterfaces(interfaces) {
  	let x = []
    for(let i = 0; i < interfaces.length; i++) {
    	const name = interfaces[i][2]
        const rest = interfaces[i][6]
        const body = rest.map((a) => a[0] + (a[1][0] ? a[1][0] : "") + ": " + a[3][0] + "\n" )
        x.push("interface " + name + " {\n" + body.join("") + "}")
    }
    return x
  }

  function extractEnums(interfaces) {
  	let x = []
    for(let i = 0; i < interfaces.length; i++) {
    	const name = interfaces[i][2]
        const rest = interfaces[i][6]
        const body = rest.map((a) => a[0] + (a[1][0] ? a[1][0] : "") + (a[2] ? a[2][4][0][0] ? " = '" + a[2][4].join("") + "'" : " = " + a[2][4][1].join("") : '') + "," + "\n" )
        x.push("enum " + name + " {\n" + body.join("") + "}")
    }
    return x
  }
 
}}

start = models:(models)
		namespaces:(namespaces)
    interfaces:(interfaces)
    enums:(enums)

{
      return {
		    models: extractModels(models),
        namespaces: extractActions(namespaces),
        interfaces: extractInterfaces(interfaces),
        enums: extractEnums(enums)
      };
    }


models = model*
namespaces = action*
interfaces = interface*
enums = enum*

interface = "interface" S* name S* "{" S* interface_body* "}" S*

enum = "enum" S* name S* "{" S* enum_body* "}" S*

enum_body = value:IDENT name* enum_identifier? ","? S*

enum_identifier = S* "=" S* "'"? (name* number*) "'"?

number = [0-9]

interface_body = value:IDENT name* S* name* S*

model = "model" S* name S* "{" S* property* "}" S*

action = "action" S* name S* "{" S* action_property* "}" S*

action_property = value:IDENT name* variables? S* name* S*

variables = "(" variable* ")"

variable = S* name S* name? ","?

property = value:IDENT S* name S* ref? S*

ref = S* "@ref" "[]"?

type = chars:nmstart+ { return chars.join(""); }

name = chars:nmstart+ { return chars.join(""); }

word = [A-z]+

nonascii
  = [\x80-\uFFFF]

unicode
  = "\\" digits:$(h h? h? h? h? h?) ("\r\n" / [ \t\r\n\f])? {
      return String.fromCharCode(parseInt(digits, 16));
    }
h
  = [0-9a-f]i

escape
  = unicode
  / "\\" @[^\r\n\f0-9a-f]i

nmstart
  = [_a-z]i
  / "[]"
  / "?"
  / nonascii
  / escape

nmchar
  = [_a-z0-9-]i
  / nonascii
  / escape

s
  = [ \t\r\n\f]+
  
S "whitespace"
  = s
  
ident
  = prefix:$"-"? start:nmstart chars:nmchar* {
      return prefix + start + chars.join("");
    }

IDENT "identifier"
  = ident:ident { return ident; }