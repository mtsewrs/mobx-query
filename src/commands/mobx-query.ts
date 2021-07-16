import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'mstq',
  description: 'Prints this',
  run: async toolbox => {
    const { printHelp } = toolbox.print

    printHelp(toolbox)
  }
}

module.exports = command
