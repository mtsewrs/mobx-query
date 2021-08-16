import { GluegunCommand } from 'gluegun'

import { buildActions } from '../utils/buildActions'
import { buildModels } from '../utils/buildModels'

import { parse } from '../utils/parser'

const scaffold: GluegunCommand = {
  name: 'scaffold',
  alias: 's',
  description:
    'Scaffold a typescript react client for fetching data from your json rpc api',
  run: async (toolbox) => {
    const {
      print,
      template: { generate },
      strings,
      system,
      parameters,
      filesystem,
    } = toolbox

    const test = parameters.options.test || false
    const out = parameters.options.out || 'src/models'
    const force = parameters.options.force || false
    const schema_src = filesystem.read(
      filesystem.path(process.cwd(), './schema.query')
    )

    if (!schema_src) throw new Error('[mobx-query] config file required')

    const config = parse(schema_src)
    buildModels(config)
    buildActions(config)

    const models = config.models.map((m) => m.name)
    config.interfaces = config.interfaces.map((interf: string) => {
      let model = []
      for (let i = 0; i < models.length; i++) {
        const m = models[i]
        if (interf.includes(m)) {
          model.push(m)
        }
      }

      for (let i = 0; i < model.length; i++) {
        const m = model[i]
        let t = 0
        interf = interf.replaceAll(m, (match) => {
          t++
          return t !== 1 ? m + 'Type' : match
        })
      }

      return interf
    })

    if (!config) throw new Error('[mobx-query] config file required')

    if (!config.models.length) {
      throw new Error('[mobx-query] scaffolding requires models')
    }

    const spinner = print.spin('Generating...')

    try {
      if (force) {
        await filesystem.removeAsync(`${out}`)
      } else {
        await filesystem.removeAsync(`${out}/base`)
      }
      const generated: string[] = []
      const promises: Promise<string | void>[] = []

      const models = config.models

      promises.push(
        generate({
          template: `root.base.ts.t`,
          target: `${out}/base/root.base.ts`,
          props: {
            plural: strings.plural,
            upperFirst: strings.upperFirst,
            config,
            namespaces: config.namespaces,
            models,
            test,
          },
        })
      )

      for (let i = 0; i < models.length; i++) {
        const model = models[i]
        if (i === 0) {
          let initial_t = ''
          initial_t =
            initial_t +
            `
              /* This is a mobx-query generated file, don't modify it manually */
              /* eslint-disable */
              /* tslint:disable */
              import { observable, makeObservable, computed, action } from 'mobx'
              import { RootStoreBase } from './root.base'
            `
          for (let j = 0; j < models.length; j++) {
            initial_t = initial_t.concat(
              `import { ${models[j].name}Type } from '../${models[j].name}Model'\n`
            )
          }

          promises.push(
            filesystem.appendAsync(`${out}/base/model.base.ts`, initial_t)
          )
        }

        const m = await generate({
          template: `model.base.ts.t`,
          props: { model, test, plural: strings.plural },
        })

        promises.push(filesystem.appendAsync(`${out}/base/model.base.ts`, m))

        if (!filesystem.exists(`${out}/${model.name}Model.ts`)) {
          promises.push(
            generate({
              template: `model.ts.t`,
              target: `${out}/${model.name}Model.ts`,
              props: { model },
            })
          )
          generated.push(` Generated ${model.name} Model`)
        } else {
          generated.push(` Skipping ${model.name} Model`)
        }
      }

      promises.push(
        generate({
          template: `index.ts.t`,
          target: `${out}/index.ts`,
          props: {
            models,
          },
        })
      )

      promises.push(
        generate({
          template: `reactUtils.ts.t`,
          target: `${out}/base/reactUtils.ts`,
          props: {
            models,
            test,
          },
        })
      )

      if (!filesystem.exists(`${out}/root.ts`)) {
        promises.push(
          generate({
            template: `root.ts.t`,
            target: `${out}/root.ts`,
            props: {
              models,
              test,
            },
          })
        )
        generated.push(` Generated RootStore`)
      } else {
        generated.push(` Skipping RootStore`)
      }

      await Promise.all(promises)

      try {
        if (toolbox.packageManager.hasYarn()) {
          await system.run(`yarn prettier --write "${out}/**/*.ts"`)
        } else {
          await system.run(`npx prettier --write "${out}/**/*.ts"`)
        }
        generated.push(` Ran prettier successfully`)
      } catch (error) {
        generated.push(
          ` Running prettier failed. Install prettier to auto format models`
        )
      }
      spinner.succeed(` Model generation successfull`)
      for (let i = 0; i < generated.length; i++) {
        const s = generated[i]
        print.success(s)
      }
    } catch (error) {
      spinner.fail(error.message)
    }
  },
}

export default scaffold
