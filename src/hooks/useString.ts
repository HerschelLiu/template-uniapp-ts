// 驼峰转中横线的方法
export const useLineString = (str: string) => {
  return str.replace(/[A-Z]/g, function ($1, index) {
    return `${index === 0 ? '' : '-'}${$1.toLowerCase()}`
  })
}

/** 转义特殊字符 */
export const useEscapeRegExp = (keyword: string) => {
  return keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
