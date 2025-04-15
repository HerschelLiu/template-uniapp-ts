import { ref } from 'vue'

import settings from '@/settings'

/** 获取图片地址 */
export const useCosImage = (url: string, cos = true) => {
  const src = url.startsWith('http') ? url : settings.imgSrc + url.replace('/static/', '')

  const imgSrc = ref(cos ? src : url)

  return imgSrc.value
}
