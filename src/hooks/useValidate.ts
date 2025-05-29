/** 是否日期 */
export function isDate(str: any): boolean {
  return /^\d{4}(-\d{1,2}){2}( \d{1,2}(:\d{1,2}){2})?$/.test(str)
}

/** 格式化金额 */
export const useInputMoneyFormat = (value: string) =>
  value
    .replace(/[^\d.]/g, '')
    .replace(/(\..*)\./g, '$1')
    .replace(/^0+(\d)/, '$1')
    .replace(/^\./, '')
    .replace(/(\.\d{2})\d+/, '$1')

/** 格式化纯整数字 */
export const useInputNumberFormat = (value: string) => value.replace(/[^\d]/g, '')

/** 格式化小数 */
export const useInputDigitFormat = (value: string, decimalPlaces = 2) =>
  value
    .replace(/[^\d.]/g, '')
    .replace(/(\..*)\./g, '$1')
    .replace(/^0+(\d)/, '$1')
    .replace(/^\./, '')
    .replace(new RegExp(`(\\.\\d{${decimalPlaces}})\\d+`), '$1')

/** 是否有效值 */
export function isHaveValue(value: unknown): boolean {
  // 1.快速处理原始类型
  switch (typeof value) {
    case 'undefined':
      return false
    case 'boolean':
      return value
    case 'number':
      return !Number.isNaN(value)
    case 'string': {
      const trimmed = value.trim()
      return !(trimmed === '' || trimmed === 'undefined' || trimmed === 'null')
    }
    case 'symbol':
      return true // Symbol默认视为有效值
  }

  // 2.处理null
  if (value === null) return false

  // 3.处理容器型对象
  const typeString = Object.prototype.toString.call(value)
  switch (typeString) {
    case '[object Array]':
      return (value as unknown[]).length > 0
    case '[object Set]':
      return (value as Set<unknown>).size > 0
    case '[object Map]':
      return (value as Map<unknown, unknown>).size > 0
    case '[object Object]':
      return Object.keys(value as object).length > 0
    case '[object Date]':
      return !Number.isNaN((value as Date).getTime())
    case '[object ArrayBuffer]':
      return (value as ArrayBuffer).byteLength > 0
    case '[object Blob]':
      return (value as Blob).size > 0
    case '[object File]':
      return (value as File).size > 0
  }

  // 4.处理DOM元素
  if (typeof window !== 'undefined' && value instanceof Node) {
    if (value.nodeType === Node.ELEMENT_NODE) {
      const elem = value as Element
      // 检查可见性属性
      if (elem.hasAttribute('hidden')) return false
      // 检查内容是否为空
      return elem.childNodes.length > 0 || elem.textContent?.trim() !== ''
    }
    return true // 非元素节点默认有效
  }

  // 5.其他对象类型
  return true
}

/**
 * 将数值/字符串格式化为金额形式
 * @param value 输入值（数字或字符串）
 * @param decimal 保留小数位数（默认2位）
 * @param thousand 是否启用千分位（默认false）
 * @returns 格式化后的金额字符串（无效输入返回空字符串）
 */
export function useFormatMoney(value: string | number, decimal = 2, thousand = false): string {
  // 输入处理（兼容字符串中的逗号和非数字字符）
  const numStr = String(value)
    .replace(/,/g, '')
    .replace(/[^\d.-]/g, '')
  const num = parseFloat(numStr)
  if (isNaN(num)) return ''

  // 截断处理（非四舍五入）
  const factor = Math.pow(10, decimal)
  const truncated = Math.trunc(num * factor) / factor // 核心截断逻辑
  const [integerPart, decimalPart = ''] = truncated.toString().split('.')

  // 补全小数位（如截断后小数不足指定位数）[2](@ref)
  const paddedDecimal = decimalPart.padEnd(decimal, '0').slice(0, decimal)

  // 千分位格式化
  const formattedInteger = thousand ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : integerPart

  return decimal > 0 ? `${formattedInteger}.${paddedDecimal}` : formattedInteger
}
