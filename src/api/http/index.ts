import type { ComposeNext, ComposeMiddleware } from './compose'

import compose from './compose'

interface IRequestOptions extends UniApp.RequestOptions {
  showLoading?: boolean
  showToast?: boolean
  format?: boolean
}

export type Next = ComposeNext
export type Middleware = ComposeMiddleware

/** 请求的计时 */
let timer: undefined | NodeJS.Timeout

/** 请求线程中的数量 */
let requestNumber = 0

class Http {
  /** 中间件 */
  private middleware: Middleware[] = []

  use(middleware: Middleware) {
    this.middleware = [...this.middleware, middleware]
    return this
  }

  request<T>(config: IRequestOptions): ResponsePromise<T> {
    return new Promise((resolve, reject) => {
      try {
        const dispatch = compose(...this.middleware)

        dispatch(this._request.bind(this))({ ...config, resolve, reject })
      } catch (error) {
        reject(error)
      }
    })
  }

  private clearTimer() {
    requestNumber--
    if (typeof timer !== 'undefined' && requestNumber === 0) {
      clearTimeout(timer)
      timer = undefined
      useHideLoading()
    }
  }

  private getHeader(): AnyObject {
    const header: AnyObject = {}
    const { accessToken } = storeToRefs(useUserStore())
    if (accessToken.value) header['Authorization'] = accessToken.value

    return header
  }

  private _request({
    url = '',
    header,
    method = 'GET',
    data,
    showToast = true,
    timeout = 10000,
    format = true,
    resolve,
    reject,
    ...args
  }: IRequestOptions & { resolve: any; reject: any }) {
    if (typeof timer === 'undefined' && !(useStorage.showLoading || false)) {
      timer = setTimeout(() => {
        useShowLoading({
          title: '加载中...'
        })
      }, 1500)
    }

    requestNumber++

    const {
      request: { url: baseURL }
    } = useSettingsStore(pinia)

    const config: UniApp.RequestOptions = {
      url: url.startsWith('http') ? url : `${baseURL}${url}`,
      header: {
        'content-type': 'application/json',
        ...Object.assign(this.getHeader(), header)
      },
      method,
      data: format ? useValue(data) : data,
      timeout,
      success: res => {
        this.clearTimer()
        this.success(res, showToast, resolve, reject)
      },
      fail: () => {
        this.clearTimer()
        reject()
        this._showError('连接失败，请检查网络', showToast)
      },
      ...args
    }

    upp.request(config)
  }

  async success(res: UniApp.RequestSuccessCallbackResult, showToast: boolean, resolve: any, reject: any) {
    const data = res.data as ResponseData<any>

    if (res.statusCode !== 200) return reject('连接失败，请检查网络')
    if (data.code === 402) {
      useThrottle(userLogout)
      return reject(data)
    }

    if (data.code === 200 && data.success === true) {
      return resolve(data)
    } else {
      this._showError(data, showToast)
      return reject(data)
    }
  }

  private _showError(error: string | AxiosError, showToast: boolean) {
    if (!showToast) return
    const title = typeof error === 'string' ? error : error ? error.msg : ''
    useShowToast({
      title: title || '连接失败，请检查网络'
    })
  }
}

export default Http
