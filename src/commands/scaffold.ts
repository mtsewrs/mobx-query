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

    if (!test && !config) throw new Error('[mstq] config file required')

    const out = config.out || parameters.options.out || 'src/models'
    const force = config.force || parameters.options.force || false
    const lib = config.lib || parameters.options.lib || 'mst'

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
        throw new Error('[mstq] scaffolding requires models option')
      }

      console.log(force, `${out}`)

      if (force) {
        await filesystem.removeAsync(`${out}`)
      } else {
        await filesystem.removeAsync(`${out}/base`)
      }

      const promises: Promise<string | void>[] = []

      const models = Array.from(schema.models.keys())
      for (let i = 0; i < models.length; i++) {
        const model = schema.models.get(models[i])

        promises.push(
          generate({
            template: `${lib}/model.base.ts.t`,
            target: `${out}/base/${models[i]}Model.base.ts`,
            props: { model, test, plural: strings.plural },
          })
        )

        if (!filesystem.exists(`${out}/${models[i]}Model.ts`)) {
          promises.push(
            generate({
              template: `${lib}/model.ts.t`,
              target: `${out}/${models[i]}Model.ts`,
              props: { model },
            })
          )
          promises.push(
            Promise.resolve(print.success(` Generating ${models[i]} Model`))
          )
        } else {
          promises.push(
            Promise.resolve(print.warning(` Skipping ${models[i]} Model`))
          )
        }
      }

      promises.push(
        generate({
          template: `${lib}/root.base.ts.t`,
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

      promises.push(
        generate({
          template: `${lib}/index.ts.t`,
          target: `${out}/index.ts`,
          props: {
            models,
          },
        })
      )

      if (lib === 'mst') {
        if (!filesystem.exists(`${out}/common/ModelBase.ts`)) {
          promises.push(
            generate({
              template: `${lib}/base.ts.t`,
              target: `${out}/common/ModelBase.ts`,
              props: {
                models,
                test,
              },
            })
          )
        } else {
          promises.push(Promise.resolve(print.warning(` Skipping ModelBase`)))
        }
      }

      promises.push(
        generate({
          template: `${lib}/reactUtils.ts.t`,
          target: `${out}/base/reactUtils.ts`,
          props: {
            models,
            test,
            lib,
          },
        })
      )

      if (!filesystem.exists(`${out}/common/root.ts`)) {
        promises.push(
          generate({
            template: `${lib}/root.ts.t`,
            target: `${out}/common/root.ts`,
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

      print.warning(` Running prettier`)
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
