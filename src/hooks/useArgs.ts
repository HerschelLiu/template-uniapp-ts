import { useShowToast } from './useTip'
import { isHaveValue } from './useValidate'

/**
 * 验证参数是否存在
 * @param args 参数名
 * @param required 是否必填，默认[是]
 * @returns 参数值
 */
export function useValidateArgs<T>(options: AnyObject | undefined, args: string, required = true): Promise<T | string> {
  return new Promise((resolve, reject) => {
    if (isHaveValue(options) && required) {
      useShowToast({ title: '页面缺少必要参数', mask: true })

      return reject({
        loading: false,
        fail: true,
        failContent: '页面缺少必要参数',
        failButtonContent: '返回',
        failRouterBack: true
      })
    } else {
      const arg = options![args]
      if (arg && isHaveValue(arg)) return resolve(arg)
      return resolve('')
    }
  })
}

export function useArgsStrToObj(url: string) {
  const obj: AnyObject = {}
  const query = url.split('&')
  query.forEach(item => {
    const [key, value] = item.split('=')
    obj[key] = decodeURIComponent(value)
  })

  return obj
}

/** 获取链接中的参数对象 */
export function useArgsUrl(url: string): AnyObject {
  const [, search] = url.split('?')
  if (!search) return {}
  return useArgsStrToObj(search)
}

/** 获取参数 */
export function useArgsObjToStr(obj: AnyObject): string {
  let url = ''
  for (const key in obj) {
    url += (url ? '&' : '') + `${key}=${obj[key]}`
  }
  return url
}
