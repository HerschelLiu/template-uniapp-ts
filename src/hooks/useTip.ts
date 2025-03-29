/** 显示loading提示框 */
export function useHideLoading() {
  if (!(useStorage.showLoading || false)) return
  useStorage.showLoading = false
  upp.hideLoading()
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
    upp.showLoading(opt)
    return
  }
  useStorage.showLoading = true
  upp.showLoading(opt)
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
    upp.showToast(opt)
    return
  }
  upp.showToast(opt)
}

/** 隐藏消息提示框 */
export function useHideToast() {
  upp.hideToast()
}
