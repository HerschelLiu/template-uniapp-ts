import { isDate } from './useValidate'

/** 获取日期格式 */
export function useDateFormat(date: string | undefined | Date | number | null, format = 'Y-M-D h:m:s'): string {
  if (typeof date === 'string') {
    date = date.trim() // 清理前后空格
  }

  // 非字符串且非有效日期/对象/数字时返回默认值
  if ((typeof date !== 'string' && !isDate(date) && typeof date !== 'object' && typeof date !== 'number') || date === null || date === undefined) {
    return typeof date === 'string' && (date as any).length ? date : '--'
  }

  // 处理 Date 对象或可转换的字符串/数字
  if (typeof date === 'number' || (typeof date === 'string' && date.includes('T'))) {
    date = new Date(date)
  }

  let obj: Record<string, string | number> = {}

  if (date instanceof Date) {
    // 处理 Date 对象
    obj = {
      Y: date.getFullYear(),
      M: date.getMonth() + 1,
      D: date.getDate(),
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds()
    }
  } else {
    // 处理字符串
    const str = date as string
    let dateSegment = ''
    let timeSegment = ''

    if (str.includes(' ')) {
      // 拆分日期和时间部分（如 "2023-01-01 12:00:00"）
      ;[dateSegment, timeSegment] = str.split(' ')
    } else if (str.includes('-')) {
      // 仅日期部分（如 "2023-01-01"）
      dateSegment = str
    } else if (str.includes(':')) {
      // 仅时间部分（如 "12:00:00"）
      timeSegment = str
    } else {
      // 无法识别格式，返回原字符串
      return str
    }

    // 解析日期部分
    const [Y = 0, M = 0, D = 0] = dateSegment.split('-').map(Number)
    // 解析时间部分
    const [h = 0, m = 0, s = 0] = timeSegment.split(':').map(Number)

    obj = { Y, M, D, h, m, s }
  }

  // 格式化替换
  const reg = /Y|M|D|h|m|s/g
  return format.replace(reg, key => {
    const value = obj[key] ?? 0 // 默认值处理
    return value.toString().padStart(2, '0') // 补零
  })
}
