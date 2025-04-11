import api from '@/api'

/** 注册 */
export const register = (data: RequestRegister): ResponsePromise<ResponseRegister> => {
  return api.request({ url: '/member/bindPhone', data })
}
export interface RequestRegister {
  jsCode: string
  phoneCode: string
}
export interface ResponseRegister {
  access_token: string
}

/** 登录 */
export const login = (data: RequestLogin): ResponsePromise<ResponseRegister> => {
  return api.request({ url: '/member/login', data })
}
export type RequestLogin = Pick<RequestRegister, 'jsCode'>

/** 退出登录 */
export const logout = () => {
  return api.request({ url: '/member/logout', method: 'POST' })
}
