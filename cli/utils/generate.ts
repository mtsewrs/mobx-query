import fs from 'fs-jetpack'
import ejs from 'ejs'

export const generate = async ({
  template,
  target,
  props,
}: {
  template: string
  target?: string
  props: any
}) => {
  const result = await ejs.renderFile(
    fs.path(__dirname, '../templates/' + template),
    {
      props,
    },
    {
      async: true,
    }
  )

  !!target && (await fs.writeAsync(target, result))

  return result
}
