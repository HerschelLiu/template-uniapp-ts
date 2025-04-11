import type { Middleware } from '@/api/http'

import { storeToRefs } from 'pinia'


import Http from '@/api/http'
import { ServerId } from '@/enum/settings'
import { useLog } from '@/hooks/useLog'
import settings from '@/settings'
import pinia from '@/store'
import { useSettingsStore } from '@/store/useSetting'

const initRequest: Middleware = next => async req => {
  const { request, serverId: serverIdStore } = storeToRefs(useSettingsStore(pinia))
  const serverId = upp.getAccountInfoSync().miniProgram.envVersion === 'release' ? ServerId['正式'] : serverIdStore.value
  if (request.value.url) return await next(req)

  try {
    const { data } = await new Http().request<{ url: string; env: string }>({
      url: settings.grayUrl,
      method: 'POST',
      data: {
        serverId
      }
    })

    Object.assign(request.value, data)
  } catch {
    // 错误回退到默认值
    Object.assign(request.value, {
      url: 'https://api.hmkf688.com',
      env: 'pro'
    })
  }

  useLog(`当前request api`, `${request.value.url}`)
  useLog(`当前request env`, `${request.value.env}`)

  return await next(req)
}

export default initRequest
