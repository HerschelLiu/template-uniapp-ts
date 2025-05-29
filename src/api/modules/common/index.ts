import api from '@/api'

/** 获取关于我们信息 */
export const getAgreement = async (): ResponsePromise<ResponseAgreement> => {
  return api.request({ url: '/common/getAgreement' })
}
export interface ResponseAgreement {
  /** 客服电话 */
  serviceTelephone: string
  /** 客服邮箱 */
  serviceEmail: string
  /** 工作时间 */
  workday: string
  /** logo */
  image: string
}
