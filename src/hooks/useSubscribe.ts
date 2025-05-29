import { getSubscribeTemplateId } from '@/api/modules/common'

import { useShowModal } from './useTip'

export const useSubscribe = (keys: Key[], type: 'scene' | 'tmplIds' = 'scene') => {
  return new Promise(resolve => {
    uni.getSetting({
      withSubscriptions: true,
      async success(res) {
        if (res.errMsg !== 'getSetting:ok') return resolve([])

        const subscriptionsSetting = res.subscriptionsSetting
        if (!subscriptionsSetting.mainSwitch) {
          useShowModal({
            title: '温馨提示',
            content: '为了更便捷的使用和及时收到推送消息，请您开启订阅消息授权。',
            confirmText: '设置',
            success(modal: UniApp.ShowModalRes) {
              if (modal.confirm) {
                uni.openSetting({
                  withSubscriptions: true
                })
              }
            }
          })
          return resolve([])
        }

        try {
          let tmplIds: string[] = []
          if (type === 'scene') {
            const { data } = await getSubscribeTemplateId(keys[0] as number)
            tmplIds = [data]
          } else {
            tmplIds = keys as string[]
          }

          uni.requestSubscribeMessage({
            tmplIds,
            success(res) {
              if (res.errMsg === 'requestSubscribeMessage:ok') {
                const result = tmplIds.map(tmplId => {
                  return {
                    tmplId,
                    result: Reflect.get(res, tmplId) // 存在则值为accept
                  }
                })

                result.forEach(item => {
                  if (typeof item.result === 'undefined') item.result = 'reject'
                })

                return resolve(result)
              }

              return resolve([])
            },
            fail() {
              return resolve([])
            }
          })
        } catch {
          return resolve([])
        }
      },
      fail() {
        return resolve([])
      }
    })
  })
}
