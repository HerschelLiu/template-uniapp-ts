/**
 * 间隔执行
 * @param ms 毫秒
 * @returns
 */
export const useSleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
