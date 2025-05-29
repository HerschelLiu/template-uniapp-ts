/** 冷启动-核心处理 */
export async function useAppLaunch() {
  useLog('冷启动', '')
}

/** 热启动-核心处理 */
export function useAppShow() {
  useUpdateManager()
  useEnterOptions()
}

/** 获取启动参数 */
export const useEnterOptions = () => {
  const options = uni.getEnterOptionsSync()
  const { scene, enterOptions } = storeToRefs(useSettingsStore())
  const query = options.query

  if (query?.scene) {
    const _query = useArgsStrToObj(decodeURIComponent(query.scene))
    Object.assign(query, _query)
  }

  enterOptions.value = query
  scene.value = options.scene

  useLog(`当前场景值`, `${scene.value}`)
  useLog(`当前启动参数`, `${JSON.stringify(enterOptions.value)}`)
}

/** 更新管理 */
export const useUpdateManager = () => {
  const updateManager = uni.getUpdateManager()
  if (updateManager) {
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          useShowModal({
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

/** 计算标题颜色透明度 */
export const getOpacity = (scrollTop: number): number => {
  if (scrollTop >= 50) return 1
  return Number((scrollTop / 50).toFixed(2))
}

export const userLogout = async () => {
  const user = useUserStore()
  await logout()
  user.isLogin = false
  user.clear()

  jumpPage({ target: 'login' })
}
