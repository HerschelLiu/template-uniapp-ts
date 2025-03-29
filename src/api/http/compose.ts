/**
 * 中间件核心 composer
 * by: https://github.com/reduxjs/redux/blob/master/src/compose.ts
 * @param {Function[]} funcs 中间件数组
 * @return {Function} (...args) => f1(f2(f3(...args)))
 */
function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    return <T>(arg: T) => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce(
    (a, b) =>
      (...args: any) =>
        a(b(...args))
  )
}

export default compose
