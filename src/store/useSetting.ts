import type { ResponseAgreement } from '@/api/modules/common'

interface SettingsState {
  request: SettingsStateRequest
  serverId: ServerId | MiniProgramEnvVersion
  protocol: Partial<ResponseAgreement>
  /**
   * 场景值。App、web端恒为 1001。钉钉小程序在 IDE 恒为0000，真机不支持。
   * @see https://developers.weixin.qq.com/miniprogram/dev/reference/scene-list.html
   */
  scene: UniApp.GetLaunchOptionsSyncOptions['scene']
  /** 日志对象 */
  RealtimeLogManager: UniApp.RealtimeLogManager | null
  /** 启动参数 */
  enterOptions: AnyObject
}
interface SettingsStateRequest {
  url: string
  env: string
}

const getServerId = (id?: ServerId) => {
  const env = uni.getAccountInfoSync().miniProgram.envVersion
  if (env === 'release') return ServerId['正式']
  return env === 'develop' && isHaveValue(id) ? id! : MiniProgramEnvVersion[env]
}

export const useSettingsStore = defineStore('settings', () => {
  const state = reactive<SettingsState>({
    request: {
      url: '',
      env: ''
    },
    serverId: getServerId(2),
    /** 协议 */
    protocol: {},
    scene: 1001,
    RealtimeLogManager: upp.getRealtimeLogManager(),
    enterOptions: {}
  })

  return {
    ...toRefs(state)
  }
})
