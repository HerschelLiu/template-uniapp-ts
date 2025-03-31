// import { login, logout, register } from '@/api/modules/system'

/** 冷启动-核心处理 */
export async function useAppLaunch() {}

/** 热启动-核心处理 */
export function useAppShow() {
  useUpdateManager()
  useEnterOptions()
}

/** 获取启动参数 */
export const useEnterOptions = () => {
  const options = upp.getEnterOptionsSync()
  const { scene, enterOptions } = storeToRefs(useSettingsStore(pinia))
  const query = options?.query ?? {}

  if (query?.scene) {
    const _query = useArgsStrToObj(decodeURIComponent(query.scene))
    Object.assign(query, _query)
  }

  enterOptions.value = query
  scene.value = options?.scene ?? ''

  useLog(`当前场景值`, `${scene.value}`)
  useLog(`当前启动参数`, `${JSON.stringify(enterOptions.value)}`)
}

/** 更新管理 */
export const useUpdateManager = () => {
  const updateManager = upp.getUpdateManager()
  if (updateManager) {
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          upp.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
              if (res.confirm) updateManager.applyUpdate()
            }
          })
        })
      }
    })
  }
}

export const userLogin = async (phoneCode?: string) => {
  const user = useUserStore(pinia)

  try {
    useShowLoading({ title: '登录中...' })
    const { code } = await upp.login({ provider: 'weixin' })
    let data = null
    if (phoneCode) {
      const res = await register({ jsCode: code, phoneCode })
      data = res.data
    } else {
      const res = await login({ jsCode: code })
      data = res.data
    }

    user.accessToken = data.access_token
    user.isLogin = true
    const prevPage = getThePage(-1)
    if (prevPage) {
      navigateBack()
    } else {
      navigateTo({ url: settings.homePath })
    }
  } catch (error) {
    user.isLogin = false
    useShowToast({ title: '登录失败' })
    console.error(error)
  } finally {
    useHideLoading()
  }
}

export const userLogout = async () => {
  const user = useUserStore(pinia)
  await logout()
  user.isLogin = false
  user.clear()

  reLaunch({ url: '/pages/login/index' })
}

/** 计算标题颜色透明度 */
export const getOpacity = (scrollTop: number): number => {
  if (scrollTop >= 50) return 1
  return Number((scrollTop / 50).toFixed(2))
}
