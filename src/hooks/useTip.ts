import { useStorage } from './useStorage'

/** 显示loading提示框 */
export function useHideLoading() {
  if (!(useStorage.showLoading || false)) return
  useStorage.showLoading = false
  uni.hideLoading()
}

/** 显示loading提示框 */
export function useShowLoading(options: UniApp.ShowLoadingOptions) {
  const opt = Object.assign(
    {
      mask: true
    },
    options
  )
  if (useStorage.showLoading || false) {
    useStorage.showLoading = true
    uni.showLoading(opt)
    return
  }
  useStorage.showLoading = true
  uni.showLoading(opt)
}

/** 显示消息提示框 */
export function useShowToast(options: UniApp.ShowToastOptions) {
  const opt = Object.assign(
    {
      icon: 'none',
      duration: 2000
    },
    options
  )
  if (useStorage.showLoading || false) {
    useHideLoading()
    uni.showToast(opt)
    return
  }
  uni.showToast(opt)
}

/** 隐藏消息提示框 */
export function useHideToast() {
  uni.hideToast()
}

/** 显示模态对话框 */
export function useShowModal(options: UniApp.ShowModalOptions) {
  uni.showModal(options)
}
