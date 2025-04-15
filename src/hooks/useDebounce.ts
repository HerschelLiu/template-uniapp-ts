/** 防抖 */
const debounceMap = new Map<AsyncVoidFunction, NodeJS.Timeout>()

export function useDebounce(func: AsyncVoidFunction, wait = 1000, immediate = false) {
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
const throttleMap = new Map<AsyncVoidFunction, boolean>()

export function useThrottle(func: AsyncVoidFunction, wait = 1000) {
  if (!throttleMap.get(func)) {
    func()
    throttleMap.set(func, true)
    setTimeout(() => {
      throttleMap.delete(func)
    }, wait)
  }
}
