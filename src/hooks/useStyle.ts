import { useLineString } from './useString'

/** 组合样式 */
export function useStyle(obj: Partial<CSSStyleDeclaration>) {
  const array: string[] = []
  for (const key in obj) {
    if (typeof obj[key] === 'string' || typeof obj[key] === 'number') {
      let keys = useLineString(key)
      if (keys.startsWith('webkit')) keys = `-${keys}`
      array.push(`${keys}: ${obj[key]}`)
    }
  }
  return array.join(';')
}

/** 增加单位 */
export function useUnit(value: string | number, unit = 'rpx') {
  if (typeof value === 'undefined' || !value.toString) return ''
  return /^-?\d+(\.\d+)?$/.test(value.toString()) ? value + unit : value.toString()
}

export interface IStylePadding {
  /** 上填充，默认已经包含了titlebar */
  top?: string
  /** 下填充 */
  bottom?: string
  /** 是否携带底部安全区 */
  hasSafeArea?: boolean
  /** 高度模式，height or min-height */
  heightMode?: string
  /** 是否需要padding-top样式 */
  hasPaddingTop?: boolean
}

export function useStylePadding(options: IStylePadding = {}) {
  const { top, bottom, hasSafeArea, heightMode, hasPaddingTop } = Object.assign(
    {
      top: '0rpx',
      bottom: '0rpx',
      hasSafeArea: true,
      heightMode: 'minHeight',
      hasPaddingTop: true
    },
    options
  )
  return useStyle({
    paddingTop: hasPaddingTop ? `calc(${top})` : '',
    [`${heightMode}`]: [`calc(100vh - ${top} - ${bottom})`]
      .concat(
        hasSafeArea
          ? [`calc(100vh - ${top} - ${bottom} - constant(safe-area-inset-bottom))`, `calc(100vh - ${top} - ${bottom} - env(safe-area-inset-bottom))`]
          : []
      )
      .join(`; ${heightMode}: `)
  })
}
