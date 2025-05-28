import type { CmdOptions, Mode } from '..'
import type { Ora } from 'ora'

import inquirer from 'inquirer'

export const getRobot = async (mode: Mode, spinner: Ora, cmdOptions: CmdOptions) => {
  let robotNum = 2

  if (['dev', 'prod'].includes(mode)) {
    switch (mode) {
      case 'dev':
      default:
        robotNum = 2
        break
      case 'prod':
        robotNum = 1
        break
    }
  } else {
    const { robot } = await inquirer.prompt({
      type: 'input',
      name: 'robot',
      message: '请输入机器人编号（3-30）',
      when: () => !cmdOptions.robot
    })

    robotNum = Number(robot ?? cmdOptions.robot)

    if (!(!isNaN(robotNum) && robotNum >= 3 && robotNum <= 30)) {
      spinner.fail('❌ 机器人编号有误')
      process.exit(1)
    }
  }

  return robotNum
}
