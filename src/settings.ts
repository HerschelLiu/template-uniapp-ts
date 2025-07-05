export interface ISettings {
  /** 小程序/APP/H5等名称 */
  name: string
  /** 同步获取系统信息 */
  systemInfo: UniApp.GetSystemInfoResult
  /** 获取小程序下该菜单按钮的布局位置信息 */
  menuButton: UniApp.GetMenuButtonBoundingClientRectRes
  /** 标题栏高度，含statusBarHeight，单位px */
  titleBarHeight: number
  /** 本地存储前缀 */
  storagePrefix: string
  /** oss图片地址前缀 */
  imgSrc: string
  /** 灰度地址 */
  grayUrl: 'https://gray.hmkf688.com/brand/sysConfig/getAppServerAddr'
  /** 内容窗口的上定位，让出titlebar的高度 */
  styleTop: string
  /** 内容窗口的上填充，让出titlebar的高度 */
  stylePadding: string
  tabbar: Tabs[]
  /** 首页路径 */
  homePath: string
  env: UniApp.MiniProgram['envVersion']
  /** 分享图片 */
  shareImage: string
}

/** 页面主样式，padding */
interface IStylePadding {
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

const systemInfo = upp.getSystemInfoSync()
const menuButton = upp.getMenuButtonBoundingClientRect()

/** 标题栏高度，含statusBarHeight，单位px */
const titleBarHeight = Math.max(44, (menuButton.top - systemInfo.statusBarHeight!) * 2 + menuButton.height) + systemInfo.statusBarHeight!

export function useStyleTop({ top } = { top: '0px' }): string {
  return useStyle({
    top: `calc(${top} + ${useUnit(titleBarHeight, 'px')})`
  })
}

export const useStylePadding = (options: IStylePadding = {}): string => {
  const { top, bottom, hasSafeArea, heightMode, hasPaddingTop } = Object.assign(
    {
      top: '0px',
      bottom: '0px',
      hasSafeArea: true,
      heightMode: 'minHeight',
      hasPaddingTop: true
    },
    options
  )

  return useStyle({
    paddingTop: hasPaddingTop ? `calc(${top} + ${useUnit(titleBarHeight, 'px')})` : '',
    [`${heightMode}`]: [`calc(100vh - ${top} - ${bottom} - ${hasPaddingTop ? useUnit(titleBarHeight, 'px') : '0px'})`]
      .concat(
        hasSafeArea
          ? [
              `calc(100vh - ${top} - ${bottom} - ${hasPaddingTop ? useUnit(titleBarHeight, 'px') : '0px'} - constant(safe-area-inset-bottom))`,
              `calc(100vh - ${top} - ${bottom} - ${hasPaddingTop ? useUnit(titleBarHeight, 'px') : '0px'} - env(safe-area-inset-bottom))`
            ]
          : []
      )
      .join(`; ${heightMode}: `)
  })
}

const settings = reactive<ISettings>({
  name: '',
  systemInfo,
  menuButton,
  titleBarHeight,
  /** 本地存储前缀 */
  storagePrefix: 'HMKF_',
  imgSrc: 'https://hmkfo.oss-cn-beijing.aliyuncs.com/wx/merchant/',
  grayUrl: 'https://gray.hmkf688.com/brand/sysConfig/getAppServerAddr',
  /** 内容窗口的上定位，让出titlebar的高度 */
  styleTop: useStyleTop(),
  /** 内容窗口的上填充，让出titlebar的高度 */
  stylePadding: useStylePadding(),
  tabbar: <Tabs[]>[
    {
      pagePath: '/pages/index/index',
      name: '首页'
    },
    {
      pagePath: '/pages/order/order',
      name: '订单'
    },
    {
      pagePath: '/pages/my/index',
      name: '我的'
    }
  ],
  homePath: 'pages/index/index',
  env: upp.getAccountInfoSync().miniProgram.envVersion,
  shareImage: ''
})

export default settings
