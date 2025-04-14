const ci = require('miniprogram-ci')
const fs = require('fs-plus')
const path = require('path')

// 在脚本开头添加颜色工具函数
const uploadLog = {
  success: text => console.log('\x1b[32m%s\x1b[0m', `✅ ${text}`),
  error: text => console.log('\x1b[31m%s\x1b[0m', `❌ ${text}`)
}

;(async () => {
  const dist = 'dist/build/mp-weixin'
  const config = JSON.parse(fs.readFileSync(path.resolve(`${dist}/project.config.json`), 'utf-8').trim())

  const args = process.argv.slice(2)
  const robot = Number(args.find(arg => arg.startsWith('--robot='))?.split('=')[1])
  const msg = args.find(arg => arg.startsWith('--msg='))?.split('=')[1] || ''
  const version = args.find(arg => arg.startsWith('--version='))?.split('=')[1] || 'Trial'

  const project = new ci.Project({
    appid: config.appid,
    type: 'miniProgram',
    projectPath: path.resolve(dist),
    privateKeyPath: path.resolve(`private.${config.appid}.key`),
    ignores: ['node_modules/**/*']
  })

  const defaultOptions = {
    project,
    version: version,
    desc: `体验-不要提审: ${msg}`,
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
  }
  if (!isNaN(robot) && robot > 0 && robot <= 30) {
    defaultOptions.robot = Number(robot)
    if (robot === 1) {
      defaultOptions.desc = `提审-机器人: ${msg}`
      if (!version) {
        return console.error('请输入版本号')
      }
    } else if (robot === 2) defaultOptions.desc = `体验-不要提审-机器人: ${msg}`
    else defaultOptions.desc = `机器人${robot}: ${msg}`
  }

  try {
    await ci.upload(defaultOptions)
    uploadLog.success('上传成功')
    process.exit(0)
  } catch (err) {
    uploadLog.error('上传失败')
    console.error(err)
    process.exit(1)
  }
})()
