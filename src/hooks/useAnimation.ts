/** 列表进入动画 */
export const useEnterAnimation = (): AnyObject => {
  const animation = uni.createAnimation()
  animation.opacity(0).translateY(30).step({ duration: 0 })
  animation.opacity(1).translateY(0).step({ duration: 1000, timingFunction: 'ease' })

  return animation.export()
}

/** 列表离开动画 */
export const useLeaveAnimation = (): AnyObject => {
  const animation = uni.createAnimation({ duration: 500, timingFunction: 'ease' })
  animation.opacity(0).translateY(30).step()

  return animation.export()
}
