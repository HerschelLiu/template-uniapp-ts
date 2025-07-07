export interface ShareOptions {
  title: string
  imageUrl: string
  path: string
  jumpType?: 'jump' | ''
  startsWith?: boolean
}

export function useDefaultShareOptions(options: Partial<ShareOptions> = {}, from?: Page.ShareAppMessageOption['from'], mode = ShareMode['default']) {
  if (from && !['button', 'menu'].includes(from)) return {}
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
      path = usePath(options?.path, options?.startsWith, options?.jumpType)
      break
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
  const Page = getThePage() ?? { route: '' }
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

  if (url.startsWith('http')) return url

  if (startsWith) {
    path = isStartsWith ? url : `/${url}`
  } else {
    path = isStartsWith ? url.slice(1) : url
  }

  return path
}
