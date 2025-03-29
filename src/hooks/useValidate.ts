/** 是否日期 */
export function isDate(str: any): boolean {
  return /^\d{4}(-\d{1,2}){2}( \d{1,2}(:\d{1,2}){2})?$/.test(str)
}

/** 格式化金额 */
export const useMoneyFormat = (value: string) =>
  value
    .replace(/[^\d.]/g, '')
    .replace(/(\..*)\./g, '$1')
    .replace(/^0+(\d)/, '$1')
    .replace(/^\./, '')
    .replace(/(\.\d{2})\d+/, '$1')

/** 格式化纯整数字 */
export const useNumberFormat = (value: string) => value.replace(/[^\d]/g, '')

/** 格式化小数 */
export const useDigitFormat = (value: string, decimalPlaces: number = 2) =>
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
