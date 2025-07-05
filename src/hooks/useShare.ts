// import { storeToRefs } from 'pinia'

// import store from '@/store'
// import { useUserStore } from '@/store/useUser'

// import { useArgsObjToStr } from './useArgs'
// import { useLog } from './useLog'
// import { getThePage } from './useRouter'

export interface IShareAppMessageOption {
  /** 转发事件来源。
   *
   * 可选值：
   * - `button`：页面内转发按钮；
   * - `menu`：右上角转发菜单。
   *
   * 最低基础库： `1.2.4`
   */
  from: 'button' | 'menu' | 'favorites'
  /** 如果 from 值是 button，则 target 是触发这次分享事件的 button，否则为 undefined */
  target: AnyObject | undefined
  /** 页面中包含`<web-view>`组件时，返回当前`<web-view>`的url
   *
   * 最低基础库： `1.6.4`
   */
  webViewUrl?: string
}

export enum ShareMode {
  'default' = ''
}

export interface ShareOptions {
  title: string
  imageUrl: string
  path: string
  jumpType?: 'jump'
  startsWith?: boolean
}

export function useDefaultShareOptions(
  options: Partial<ShareOptions> = {},
  from?: Page.ShareAppMessageOption['from'],
  mode: ShareMode = ShareMode['default']
) {
  let path: string | undefined = ''
  options = Object.assign(
    {
      title: settings.name,
      imageUrl: settings.shareImage
    },
    options
  )

  switch (mode) {
    default:
      path = usePath(options?.path, options.startsWith, options.jumpType)
  }

  useLog(`分享链接`, `${path}`)

  return {
    title: options.title,
    imageUrl: options.imageUrl,
    path
  }
}

/** 获取链接,未传url则取当前页面路径，需要跳板页(包含http)的返回pages/jump/jump?path=原路径，非跳板页直接返回原路径，末尾带?或& */
export function usePath(url?: string, startsWith = false, jumpType: ShareOptions['jumpType'] = 'jump') {
  const Page = getThePage() ?? ''
  let path = dealPath(url ?? Page.route!, startsWith)

  if (path.startsWith('http') || jumpType === 'jump') {
    path = `${dealPath('/pages/jump/jump', startsWith)}?page=${encodeURIComponent(path)}`
  }

  return `${path}${path.includes('?') ? '&' : '?'}`
}

/** 仅处理路径前是否有'/'，不处理参数，http直接返回 */
export function dealPath(url: string, startsWith: boolean) {
  let path = ''
  const isStartsWith = url.startsWith('/')

  if (path.startsWith('http')) return url

  if (startsWith) {
    path = isStartsWith ? url : `/${url}`
  } else {
    path = isStartsWith ? url.slice(1) : url
  }

  return path
}
