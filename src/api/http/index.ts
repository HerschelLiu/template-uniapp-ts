import type { ComposeNext, ComposeMiddleware } from './compose'

interface IRequestOptions extends UniApp.RequestOptions {
  showLoading?: boolean
  showToast?: boolean
  format?: boolean
}
export type Next = ComposeNext
export type Middleware = ComposeMiddleware
export type HttpInstance = {
  use: (middleware: Middleware) => HttpInstance
  request: <T>(config: IRequestOptions) => ResponsePromise<T>
}

let timer: undefined | NodeJS.Timeout
let requestNumber = 0

export const createHttp = (): HttpInstance => {
  const middleware: Middleware[] = []

  const clearTimer = () => {
    requestNumber--
    if (timer && requestNumber === 0) {
      clearTimeout(timer)
      timer = undefined
      useHideLoading()
    }
  }

  const getHeader = (): AnyObject => {
    const header: AnyObject = {}
    const { accessToken } = storeToRefs(useUserStore())
    if (accessToken.value) header['Authorization'] = accessToken.value
    return header
  }

  const successHandler = async (res: UniApp.RequestSuccessCallbackResult, showToast: boolean, resolve: any, reject: any) => {
    const data = res.data as ResponseData<any>

    if (res.statusCode !== 200) return reject('连接失败，请检查网络')
    if (data.code === 402) {
      useThrottle(userLogout)
      return reject(data)
    }

    if (data.code === 200 || data.success === true) {
      return resolve(data)
    } else {
      _showError(data, showToast)
      return reject(data)
    }
  }

  const _showError = (error: string | AxiosError, showToast: boolean) => {
    if (!showToast) return
    const title = typeof error === 'string' ? error : error ? error.msg : ''
    useShowToast({
      title: title || '连接失败，请检查网络'
    })
  }

  const _request = ({
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
  }: IRequestOptions & { resolve: any; reject: any }) => {
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
        ...Object.assign(getHeader(), header)
      },
      method,
      data: format ? useValue(data) : data,
      timeout,
      success: res => {
        clearTimer()
        successHandler(res, showToast, resolve, reject)
      },
      fail: () => {
        clearTimer()
        reject()
        _showError('连接失败，请检查网络', showToast)
      },
      ...args
    }

    upp.request(config)
  }

  return {
    use(mw: Middleware) {
      middleware.push(mw)
      return this
    },
    request<T>(config: IRequestOptions): ResponsePromise<T> {
      return new Promise((resolve, reject) => {
        try {
          const dispatch = compose(...middleware)
          dispatch(_request.bind(this))({ ...config, resolve, reject })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
