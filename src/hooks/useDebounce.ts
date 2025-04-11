/** 防抖 */
type GenericFunction = (..._: unknown[]) => unknown
const debounceMap = new Map<GenericFunction, NodeJS.Timeout>()

export function useDebounce(func: GenericFunction, wait = 1000, immediate = false): void {
  const timeout = debounceMap.get(func)
  if (timeout) {
    clearTimeout(timeout)
  }

  if (immediate && !timeout) {
    func()
  }

  const newTimeout = setTimeout(() => {
    debounceMap.delete(func)
    if (!immediate) {
      func()
    }
  }, wait)

  debounceMap.set(func, newTimeout)
}

/** 节流 */
const throttleMap = new Map<GenericFunction, boolean>()

export function useThrottle(func: GenericFunction, wait = 1000): void {
  if (!throttleMap.get(func)) {
    func()
    throttleMap.set(func, true)
    setTimeout(() => {
      throttleMap.delete(func)
    }, wait)
  }
}
