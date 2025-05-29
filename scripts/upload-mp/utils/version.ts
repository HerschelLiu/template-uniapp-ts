import path from 'path'

import fs from 'fs-plus'

import jsonTemplate from '../template/versions'

const versionsPath = path.resolve(process.cwd(), 'versions.json')

/** 读取/创建 versions.json */
export const readVersions = () => {
  try {
    return JSON.parse(fs.readFileSync(versionsPath, 'utf-8'))
  } catch {
    const version = '0.0.0'
    const template = { ...jsonTemplate }
    writeVersions(version)

    return Object.assign(template, { 'mp-weixin': { version } })
  }
}

export const writeVersions = (version: string) => {
  const template = { ...jsonTemplate }
  const content = Object.assign(template, { 'mp-weixin': { version } })
  fs.writeFileSync(versionsPath, JSON.stringify(content, null, 2))
}
