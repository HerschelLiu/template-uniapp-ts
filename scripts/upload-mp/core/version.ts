import type { CmdOptions, Mode } from '..'
import type { Ora } from 'ora'

import inquirer from 'inquirer'

import { readVersions, writeVersions } from '../utils/version'

export const getVersion = async (mode: Mode, spinner: Ora, cmdOptions: CmdOptions) => {
  const config = readVersions()
  let versionStr = 'Trial'

  if (mode === 'dev') return versionStr

  try {
    const { version } = await inquirer.prompt({
      type: 'input',
      name: 'version',
      message: '请输入版本号',
      default: mode === 'prod' ? config['mp-weixin'].version : 'Trial',
      when: () => !cmdOptions.version
    })

    if (mode === 'prod') {
      writeVersions(version)
      versionStr = version ?? cmdOptions.version
    }
  } catch {
    if (mode === 'prod') {
      spinner.fail('❌ 请输入版本号')
      process.exit(1)
    }
  }

  return versionStr
}
