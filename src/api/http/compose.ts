/**
 * 中间件核心 composer
 * by: https://github.com/reduxjs/redux/blob/master/src/compose.ts
 * @param {Function[]} funcs 中间件数组
 * @return {Function} (...args) => f1(f2(f3(...args)))
 */

// 定义更通用的类型，使用泛型来适应扩展的请求选项
export type ComposeNext = (_: any) => Promise<any> | void
export type ComposeMiddleware = (next: ComposeNext) => (_: any) => Promise<any> | void

function compose(...funcs: ComposeMiddleware[]): ComposeMiddleware {
  if (funcs.length === 0) {
    return next => req => next(req)
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => next => a(b(next)))
}

export default compose
