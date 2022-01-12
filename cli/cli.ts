import { cac } from 'cac'
import fs from 'fs-jetpack'
import which from 'which'
import ora from 'ora'
import * as colors from 'colors'
import pluralize from 'pluralize'
import execa from 'execa'

import { buildActions } from './utils/buildActions'
import { buildModels } from './utils/buildModels'
import { parse } from './utils/parser'
import { generate } from './utils/generate'

colors.setTheme({
  highlight: 'cyan',
  info: 'reset',
  warning: 'yellow',
  success: 'green',
  error: 'red',
  line: 'grey',
  muted: 'grey',
})

const cli = cac()

cli
  // Simply omit the command name, just brackets
  .command('scaffold', 'Generate mobx models')
  .option('--out <dir>', 'The out directory of models')
  .option('--force', 'Delete everything related to mobx-query')
  .action(async (options: { out?: string; force?: boolean }) => {
    const test = process.env.NODE_ENV === 'test'
    const out = options.out || 'src/models'
    const force = options.force || false

    const spinner = ora('Generating...').start()

    try {
      const schema_src = fs.read(fs.path(process.cwd(), './schema.query'))
      if (!schema_src) throw new Error('[mobx-query] config file required')

      const config = parse(schema_src)

      buildModels(config)
      buildActions(config)

      const model_names = config.models.map((m) => m.name)
      config.interfaces = config.interfaces.map((interf: string) => {
        let model = []
        for (let i = 0; i < model_names.length; i++) {
          const m = model_names[i]
          if (interf.includes(m)) {
            model.push(m)
          }
        }

        for (let i = 0; i < model.length; i++) {
          const m = model[i]
          interf = interf.replaceAll(m, m + 'Model')
        }

        return interf
      })

      if (!config.models.length) {
        throw new Error('[mobx-query] scaffolding requires models')
      }

      if (force) {
        await fs.removeAsync(`${out}`)
      } else {
        await fs.removeAsync(`${out}/base`)
      }

      const generated: {
        type:
          | 'success'
          | 'info'
          | 'debug'
          | 'warning'
          | 'error'
          | 'highlight'
          | 'muted'
        message: string
      }[] = []
      const promises: Promise<string | void>[] = []

      const models = config.models

      promises.push(
        generate({
          template: `root.base.ts.t`,
          target: `${out}/base/root.base.ts`,
          props: {
            plural: pluralize.plural,
            upperFirst: pluralize.upperFirst,
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
          let initial_t = `
            /* This is a mobx-query generated file, don't modify it manually */
            /* eslint-disable */
            /* tslint:disable */
            import { observable, makeObservable, computed, action } from 'mobx'
            import { RootStore } from '../root'
          `
          for (let j = 0; j < models.length; j++) {
            initial_t = initial_t.concat(
              `import { ${models[j].name}Model } from '../${models[j].name}Model'\n`
            )
          }

          initial_t = initial_t.concat(config.enums.join('\n'))

          await fs.appendAsync(`${out}/base/model.base.ts`, initial_t)
        }

        const m = await generate({
          template: `model.base.ts.t`,
          props: { model, test, plural: pluralize.plural },
        })

        await fs.appendAsync(`${out}/base/model.base.ts`, m)

        if (!fs.exists(`${out}/${model.name}Model.ts`)) {
          promises.push(
            generate({
              template: `model.ts.t`,
              target: `${out}/${model.name}Model.ts`,
              props: { model },
            })
          )
          generated.push({
            message: ` Generated ${model.name} Model`,
            type: 'success',
          })
        } else {
          generated.push({
            message: ` Skipped ${model.name} Model`,
            type: 'muted',
          })
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

      if (!fs.exists(`${out}/root.ts`)) {
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
        generated.push({ message: ` Generated RootStore`, type: 'success' })
      } else {
        generated.push({ message: ` Skipped RootStore`, type: 'muted' })
      }

      await Promise.all(promises)

      try {
        spinner.text = 'Running prettier'
        if (which.sync('yarn', { nothrow: true })) {
          await execa('yarn', ['prettier', '--write', `${out}/**/*.ts`])
        } else {
          await execa('npx', ['prettier', '--write', `${out}/**/*.ts`])
        }
        generated.push({
          message: ` Prettier ran successfully`,
          type: 'success',
        })
      } catch (error) {
        generated.push({
          message: ` Running prettier failed. Install prettier to auto format models`,
          type: 'highlight',
        })
      }
      spinner.succeed(` Model generation successfull`)
      for (let i = 0; i < generated.length; i++) {
        const s = generated[i]
        const print = (colors as any).default
        console.log(print[s.type](s.message))
      }
    } catch (error) {
      spinner.fail(error.message)
    }
  })

module.exports = { cli }
