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
  const { scene, enterOptions } = storeToRefs(useSettingsStore(store))
  const query = options.query

  if (query.page && query.page.includes('?')) {
    const [_, _params] = query.page.split('?')
    const _obj = useArgsStrToObj(_params)
    Object.assign(query, _obj)
  }

  if (query?.scene) {
    const _query = useArgsStrToObj(decodeURIComponent(query.scene))
    Object.assign(query, _query)

    /**
     * 此部分代码作用
     * 微信小程序生成太阳码api中，对于参数有长度限制，让后端对接api出一个接口，返回一个id；再出一个解码接口用于使用id取回数据库中保存的参数
     */
    // if (_query?.qrSceneId) {
    // 根据id取参数
    //   const obj = await useSettingsStore().decodeCodeScene(_query?.qrSceneId)
    //   Object.assign(query, obj)
    //   console.log(`太阳码内参数 obj：${JSON.stringify(obj)}`)
    // }
  }

  enterOptions.value = query
  scene.value = options.scene

  useLog(`当前场景值`, `${scene.value}`)
  useLog(`当前启动参数`, `${JSON.stringify(enterOptions.value)}`)
}

/** 页面参数处理 */
export const useFormatQuery = async (options: AnyObject | undefined) => {
  if (!options) return {}
  const query = reactive(options)
  const { enterOptions } = storeToRefs(useSettingsStore(store))

  // 解小程序码
  // const { decodeCodeScene } = useSettingsStore(store)
  // if (query.scene && query.scene.includes('qrSceneId')) {
  // const sceneObj = useArgsStrToObj(decodeURIComponent(options.scene))
  // const obj = await decodeCodeScene(sceneObj?.qrSceneId)
  // Object.assign(query, obj)
  // Reflect.deleteProperty(query, 'scene')
  // }

  if (query.page) {
    query.page = decodeURIComponent(query.page)

    if (query.page.includes('?')) {
      const [_, _params] = query.page.split('?')
      const _obj = useArgsStrToObj(_params)
      Object.assign(query, _obj)
    }
  }

  Object.assign(enterOptions.value, query)

  useLog('useFormatQuery', JSON.stringify(query))

  return query
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

/** titlebar透明背景操作 */
export const useTitleBarOpacity = (distance = 50) => {
  const titleOpacity = ref(0)

  const getOpacity = (scrollTop: number): number => {
    if (scrollTop >= distance) return 1
    return Number((scrollTop / distance).toFixed(2))
  }

  // !uniapp页面中的必须引用onPageScroll，不然就算此hooks导入了onPageScroll，此部分代码也不会执行
  onPageScroll(e => {
    const opacity = getOpacity(e.scrollTop)
    if (opacity === titleOpacity.value) return
    titleOpacity.value = opacity
  })

  return titleOpacity
}
