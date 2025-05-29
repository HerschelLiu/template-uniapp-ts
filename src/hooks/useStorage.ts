import settings from '@/settings'

const { storagePrefix } = settings

/** 存储缓存-中间件 */
function useSetStorageSync(key: string, data: any) {
  uni.setStorageSync(`${storagePrefix}${key}`, data)
}

/** 取值缓存-中间件 */
function useGetStorageSync(key: string): any {
  const data = uni.getStorageSync(`${storagePrefix}${key}`) || ''
  return data || 'null'
}

/** 本地缓存-中间处理 */
const storage = {}
export const useStorage = new Proxy(storage, {
  get(target: any, key: string) {
    if (!Reflect.has(storage, key)) Reflect.set(target, key, useGetStorageSync(key))
    return Reflect.get(target, key)
  },
  set(target: any, key: string, value: any) {
    Reflect.set(target, key, value)
    useSetStorageSync(key, value)
    return true
  }
})
