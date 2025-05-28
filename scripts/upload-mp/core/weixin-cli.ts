import type { Ora } from 'ora'

import path from 'path'

import fs from 'fs-plus'
import * as ci from 'miniprogram-ci'

export interface UploadToMPOptions {
  robot: number
  version: string
  desc: string
}

export const uploadToMP = async (spinner: Ora, options: UploadToMPOptions) => {
  const distPath = path.resolve(process.cwd(), 'dist/build/mp-weixin')
  const config = JSON.parse(fs.readFileSync(path.resolve(`${distPath}/project.config.json`), 'utf-8').trim())
  const privateKeyPath = path.resolve(process.cwd(), `private.${config.appid}.key`)

  if (!fs.existsSync(privateKeyPath)) {
    console.error(`目录${process.cwd()}下，不存在小程序代码上传密钥`)
    process.exit(1)
  }
  spinner.start('小程序上传中')
  const project = new ci.Project({
    appid: config.appid,
    type: 'miniProgram',
    projectPath: distPath,
    privateKeyPath,
    ignores: ['node_modules/**/*']
  })

  try {
    await ci.upload({
      project,
      robot: options.robot,
      version: options.version,
      desc: options.desc,
      setting: {
        es6: true,
        es7: true,
        minifyJS: true,
        minifyWXML: true,
        minifyWXSS: true,
        minify: true,
        codeProtect: false,
        autoPrefixWXSS: true
      }
    })
    spinner.succeed('小程序上传成功')
    process.exit(0)
  } catch (error) {
    spinner.fail('小程序上传失败')
    console.error(error)
    process.exit(1)
  }
}
