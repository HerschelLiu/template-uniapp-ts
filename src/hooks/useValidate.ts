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
export function isHaveValue(value: any): boolean {
  return !(
    typeof value === 'undefined' ||
    value === null ||
    (typeof value === 'number' && isNaN(value)) ||
    (typeof value === 'string' && (value.toString().trim() === '' || value.toString().trim() === 'undefined')) ||
    value.toString().trim() === 'null'
  )
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
