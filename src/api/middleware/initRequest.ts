import type { Middleware } from '@/api/http/index'

import { storeToRefs } from 'pinia'

import { useSettingsStore } from '@/store/useSetting'

const initRequest: Middleware = next => async req => {
  const { request, serverId: serverIdStore } = storeToRefs(useSettingsStore(pinia))
  if (request.value.url) return await next(req)

  try {
    const { data } = await createHttp().request<{ url: string; env: string }>({
      url: settings.grayUrl,
      method: 'POST',
      data: {
        serverId: serverIdStore.value
      }
    })

    Object.assign(request.value, data)
  } catch {
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
