export type Mode = 'dev' | 'prod'
export interface CmdOptions {
  msg: string
  version: string
  robot: number
}

import { Command } from 'commander'
import ora from 'ora'

import { getDescription } from './core/description'
import { getRobot } from './core/robot'
import { getVersion } from './core/version'
import { uploadToMP } from './core/weixin-cli'
import { runBuild } from './utils/build'

const spinner = ora({
  spinner: {
    interval: 80,
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  }
})
const program = new Command()

async function run(mode: Mode, cmdOptions: CmdOptions) {
  await runBuild(spinner)
  const robot = await getRobot(mode, spinner, cmdOptions)
  const version = await getVersion(mode, spinner, cmdOptions)
  const desc = await getDescription(mode, cmdOptions)
  await uploadToMP(spinner, { robot, version, desc })
}

program
  .description('上传小程序体验版')
  .argument('[mode]')
  .option('--msg <string>', '备注内容')
  .option('--version <string>', '版本号')
  .option('--robot <number>', '机器人编号', parseInt)
  .action(async (mode: Mode, options) => await run(mode, options))

program.parse(process.argv)

process.on('uncaughtException', error => {
  if (error.name === 'ExitPromptError') {
    console.log('\n👋 主动退出')
    process.exit(0)
  }

  console.error('Unhandled error:', error)
  process.exit(1)
})
