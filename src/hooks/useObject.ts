import { isHaveValue } from './useValidate'

/** 递归删除对象的指定key */
export function useDeleteObjectKey<T>(arg: T, deleteKey: string[]): T {
  if (Object.prototype.toString.call(arg) === '[object Object]') {
    const obj: any = {}
    for (const key in arg) {
      if (!deleteKey.includes(key)) obj[key] = useDeleteObjectKey(arg[key], deleteKey)
    }
    return obj
  } else if (Array.isArray(arg)) return arg.map(item => useDeleteObjectKey(item, deleteKey)) as any
  else return arg
}

/** 深拷贝 */
export function useClone<T>(val: T): T {
  if (Object.prototype.toString.call(val) === '[object Object]') {
    const obj: any = {}
    for (const key in val) {
      obj[key] = useClone(val[key])
    }
    return obj
  } else if (Array.isArray(val)) return val.map(item => useClone(item)) as unknown as T
  else return val
}

/** 移除对象的无效值 */
export function useValue<T>(object: T): T {
  if (Object.prototype.toString.call(object) === '[object Object]') {
    const obj: any = {}
    for (const key in object) {
      const value = useValue(object[key])
      if (isHaveValue(value)) obj[key] = value
    }
    return obj
  } else if (Array.isArray(object)) return object.map(item => useValue(item)) as unknown as T
  else return object
}

/** 重置对象 */
export function useResetObject<T>(object: T, resetObject: T, notReset: string[] = []) {
  for (const key in resetObject) {
    if (!notReset.includes(key)) {
      object[key] = resetObject[key]
    }
  }
}
