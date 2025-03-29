/**
 * 获取对象的最深层级
 * @param obj 要计算深度的对象
 * @param key 子对象的键名，默认为 'children'
 * @returns 对象的最深层级
 */
export const useGetObjMaxDepth = <T extends object>(obj: T, key = 'children'): number => {
  if (!Reflect.has(obj, key)) {
    return 1
  }

  const children = Reflect.get(obj, key) as T[]
  if (!Array.isArray(children) || children.length === 0) {
    return 1
  }

  return 1 + Math.max(...children.map(child => useGetObjMaxDepth(child, key)))
}

/**
 * 获取对象数组中最深层级
 * @param arr 对象数组
 * @param key 子对象的键名，默认为 'children'
 * @returns 数组中最深层级
 */
export const getArrayMaxDepth = <T extends object>(arr: T[], key = 'children'): number => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return 0
  }

  return Math.max(...arr.map(item => useGetObjMaxDepth(item, key)))
}

/** 获取对应id的数据项 */
export function useFindNode<T extends object>(data: T[], id: string, idKey = 'id', key = 'children'): T | null {
  for (let i = 0; i < data.length; i++) {
    if (Reflect.get(data[i], idKey) === id) {
      return data[i]
    } else if (Reflect.has(data[i], key)) {
      const result = useFindNode(Reflect.get(data[i], key) as T[], id, idKey, key)
      if (result) {
        return result
      }
    }
  }
  return null
}

/**
 * 返回目标节点的所有祖先节点数组
 * @returns { node: T | null; ancestors: T[] } node - 目标节点，ancestors - 所有祖先节点数组
 */
export function useFindNodeWithAncestors<T extends object>(
  data: T[],
  id: string,
  idKey = 'id',
  key = 'children',
  ancestors: T[] = []
): { node: T | null; ancestors: T[] } {
  for (let i = 0; i < data.length; i++) {
    const currentAncestors = [...ancestors, data[i]]
    if (Reflect.get(data[i], idKey) === id) {
      return { node: data[i], ancestors }
    } else if (Reflect.has(data[i], key)) {
      const result = useFindNodeWithAncestors(Reflect.get(data[i], key) as T[], id, idKey, key, currentAncestors)
      if (result.node) {
        return result
      }
    }
  }
  return { node: null, ancestors: [] }
}
