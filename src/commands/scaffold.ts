import { GluegunCommand } from 'gluegun'

import { buildActions } from '../lib/utils/buildActions'
import { buildModels } from '../lib/utils/buildModels'
import { schema, Options } from '../lib/utils/schema'

const scaffold: GluegunCommand = {
  name: 'scaffold',
  alias: 's',
  description:
    'Scaffold a typescript react client for fetching data from your jsonrpc api',
  run: async (toolbox) => {
    const {
      print,
      template: { generate },
      config: { loadConfig },
      strings,
      system,
      parameters,
      filesystem,
    } = toolbox

    const test = parameters.options.test || false
    const config: Options = loadConfig(
      'mobx-query',
      filesystem.path(process.cwd(), test ? './tests' : '')
    )

    if (!test && !config) throw new Error('[mobx-query] config file required')

    const out = config.out || parameters.options.out || 'src/models'
    const force = config.force || parameters.options.force || false

    try {
      if (config.actions) {
        const schema_actions = Object.keys(config.actions || {})
        for (let i = 0; i < schema_actions.length; i++) {
          const namespace = schema_actions[i]
          const action = config.actions[namespace]
          buildActions(namespace, action)
        }
      }

      if (config.models) {
        buildModels(config.models)
      }

      if (!schema.models.size) {
        throw new Error('[mobx-query] scaffolding requires models option')
      }

      if (force) {
        await filesystem.removeAsync(`${out}`)
      } else {
        await filesystem.removeAsync(`${out}/base`)
      }

      const promises: Promise<string | void>[] = []

      const models = Array.from(schema.models.keys())

      promises.push(
        generate({
          template: `root.base.ts.t`,
          target: `${out}/base/root.base.ts`,
          props: {
            plural: strings.plural,
            upperFirst: strings.upperFirst,
            schema,
            actions: Array.from(schema.actions.keys()),
            models,
            test,
          },
        })
      )

      for (let i = 0; i < models.length; i++) {
        const model = schema.models.get(models[i])
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
              `import { ${models[j]}Type } from '../${models[j]}Model'\n`
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

        if (!filesystem.exists(`${out}/${models[i]}Model.ts`)) {
          promises.push(
            generate({
              template: `model.ts.t`,
              target: `${out}/${models[i]}Model.ts`,
              props: { model },
            })
          )
          promises.push(
            Promise.resolve(print.success(` Generated ${models[i]} Model`))
          )
        } else {
          promises.push(
            Promise.resolve(print.warning(` Skipping ${models[i]} Model`))
          )
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
      } else {
        promises.push(Promise.resolve(print.warning(` Skipping RootStore`)))
      }

      await Promise.all(promises)

      print.info(` Running prettier...`)
      try {
        if (toolbox.packageManager.hasYarn()) {
          await system.run(`yarn prettier --write "${out}/**/*.ts"`)
        } else {
          await system.run(`npx prettier --write "${out}/**/*.ts"`)
        }
        print.success(` Prettier done`)
      } catch (error) {
        print.warning(
          ` Running prettier failed. Install prettier to auto format models`
        )
      }
      print.success(` ${print.checkmark} Model generation successfull`)
    } catch (error) {
      print.error(error.message)
    }
  },
}

export default scaffold
