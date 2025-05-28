import type { Ora } from 'ora'

import { execSync } from 'child_process'

/** 工具函数：执行构建命令 */
export const runBuild = async (spinner: Ora) => {
  try {
    spinner.start('正在构建小程序')
    execSync('npm run build:mp-weixin', { stdio: 'inherit' })
    spinner.succeed('✅构建成功')
  } catch (error) {
    spinner.fail('❌构建失败')
    console.error(error)
    process.exit(1)
  }
}
