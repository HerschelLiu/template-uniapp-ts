import type { CmdOptions, Mode } from '..'

import inquirer from 'inquirer'

export const getDescription = async (mode: Mode, cmdOptions: CmdOptions) => {
  let desc = ''

  const { msg } = await inquirer.prompt({
    type: 'input',
    name: 'msg',
    message: '请输入备注内容',
    when: () => !cmdOptions.msg
  })

  switch (mode) {
    case 'dev':
    default:
      desc = `体验-不要提审: ${msg ?? cmdOptions.msg}`
      break
    case 'prod':
      desc = `提审: ${msg ?? cmdOptions.msg}`
      break
  }

  return desc
}
