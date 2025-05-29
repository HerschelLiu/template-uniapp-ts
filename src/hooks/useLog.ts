import { storeToRefs } from 'pinia'

import settings from '@/settings'
import pinia from '@/store'
import { useSettingsStore } from '@/store/useSetting'

const isDevTools = uni.getSystemInfoSync().platform === 'devtools'

/** 打印，生产环境时会将日志推送至小程序后台 */
export function useLog(title: string, info: string) {
  const { RealtimeLogManager } = storeToRefs(useSettingsStore(pinia))

  if (isDevTools) {
    console.log(
      `%c${title}%c${info}`,
      'background-color: #43bb88; color: #ffffff; padding: .2em 0.5em; border-radius: 3px 0 0 3px;',
      'background-color: #f47920; color: #ffffff; padding: .2em 0.5em; border-radius: 0 3px 3px 0;'
    )
  } else console.log(`${title}: ${info}`)

  if (settings.env === 'release') {
    RealtimeLogManager.value?.info([`${title}: ${info}`])
  }
}
