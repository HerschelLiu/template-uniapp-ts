import type { ResponseBrandInfo } from '@/api/modules/brand'

import { storeToRefs } from 'pinia'



import { getBrandInfo } from '@/api/modules/brand'
import { login, logout, register } from '@/api/modules/system'
import { getAgreement } from '@/api/modules/system/file'
import { MerchantStatus } from '@/enum/merchant'
import settings from '@/settings'
import pinia from '@/store'
import { useBrandStore } from '@/store/useBrand'
import { useSettingsStore } from '@/store/useSetting'
import { useUserStore } from '@/store/useUser'

import { useArgsStrToObj } from './useArgs'
import { useLog } from './useLog'
import { getThePage, navigateTo, redirectTo, reLaunch } from './useRouter'
import { useHideLoading, useShowLoading, useShowModal, useShowToast } from './useTip'
import { isHaveValue } from './useValidate'


/** 冷启动-核心处理 */
export async function useAppLaunch() {
  readAgreement()
}

/** 热启动-核心处理 */
export function useAppShow() {
  useUpdateManager()
  useEnterOptions()
}

/** 获取启动参数 */
export const useEnterOptions = () => {
  const options = uni.getEnterOptionsSync()
  const { scene, enterOptions } = storeToRefs(useSettingsStore(pinia))
  const query = options.query

  if (query?.scene) {
    const _query = useArgsStrToObj(decodeURIComponent(query.scene))
    Object.assign(query, _query)
  }

  enterOptions.value = query
  scene.value = options.scene

  useLog(`当前场景值`, `${scene.value}`)
  useLog(`当前启动参数`, `${JSON.stringify(enterOptions.value)}`)
}

/** 更新管理 */
export const useUpdateManager = () => {
  const updateManager = uni.getUpdateManager()
  if (updateManager) {
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          useShowModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
              if (res.confirm) updateManager.applyUpdate()
            }
          })
        })
      }
    })
  }
}

/** 获取各种协议 */
export const readAgreement = async () => {
  const { protocol, info } = storeToRefs(useSettingsStore(pinia))
  if (Object.values(protocol.value).every(item => isHaveValue(item))) return
  const { data } = await getAgreement()
  protocol.value.privacyAgreement = data.privacyAgreement
  protocol.value.platformProtocol = data.platformProtocol
  protocol.value.shopAgreement = data.shopAgreement

  Object.keys(info.value).forEach(key => {
    Reflect.set(info.value, key, Reflect.get(data, key))
  })
}

export const userLogin = async (phoneCode?: string) => {
  const user = useUserStore(pinia)
  const { brand, company, identity } = storeToRefs(useBrandStore(pinia))

  try {
    useShowLoading({ title: '登录中...' })
    const { code } = await uni.login({ provider: 'weixin' })
    let data = null
    if (phoneCode) {
      const res = await register({ jsCode: code, phoneCode })
      data = res.data
      user.phone = data.phone
    } else {
      const res = await login({ jsCode: code, phone: user.phone })
      data = res.data
    }

    user.accessToken = data.access_token

    company.value = data.company
    user.isLogin = true
    if (data.brand.length && data.brand[0].brandId) {
      readBrand(true, data.brand[0].brandId)
      handleLoginJump(data.brand[0].brandId)
    } else {
      let url = ''
      if (identity.value === 'brand') {
        url = '/packageBusiness/pages/checkIn/index'
      }
      navigateTo({ url })
    }
  } catch (error) {
    user.isLogin = false
    brand.value = {} as ResponseBrandInfo
    useShowToast({ title: '登录失败' })
    console.error(error)
  } finally {
    useHideLoading()
  }
}

export const userLogout = async () => {
  const user = useUserStore(pinia)
  await logout()
  useBrandStore(pinia).clear()
  user.isLogin = false
  user.clear()

  reLaunch({ url: '/pages/login/index' })
}

/** 获取门店信息 */
export const readBrand = async (storage = false, comBrandId?: string) => {
  const { brand } = storeToRefs(useBrandStore(pinia))
  const user = useUserStore(pinia)
  const brandId = comBrandId ?? brand.value.brandId
  const { data } = await getBrandInfo(brandId)
  user.userId = data.userId

  if (storage) {
    brand.value = data
  }

  return data
}

/** 跳转审核逻辑 */
export const handleLoginJump = async (brandId?: string) => {
  const prevPage = getThePage(-1)
  const { brand } = storeToRefs(useBrandStore(pinia))
  let brandInfo = {} as ResponseBrandInfo

  if (brandId) {
    brandInfo = await readBrand(false, brandId)
  } else {
    brandInfo = brand.value
  }

  if (prevPage && prevPage.route === 'pages/my/index') {
    // NOTE: 因业务调整，管理员无法切换店铺 res.status == MerchantStatus['易宝审核通过'] &&
    if (brandInfo.fadadaAuthStatus == 1 && brandInfo.fadadaSignStatus == 1) {
      brand.value = brandInfo

      navigateTo({
        url: `/${settings.homePath}`
      })
      return
    }
  }

  if (prevPage && prevPage.route === 'packageBusiness/pages/contract/index') {
    brand.value = brandInfo
  }

  if ([MerchantStatus['平台审核中'], MerchantStatus['平台审核驳回']].includes(brandInfo.status)) {
    redirectTo({
      url: `/packageBusiness/pages/storeAudit/index?brandId=${brandInfo.brandId}`
    })
  } else if (brandInfo.fadadaAuthStatus != 1 || brandInfo.fadadaSignStatus != 1) {
    brand.value = brandInfo
    reLaunch({
      url: '/packageBusiness/pages/contract/index'
    })
  } else {
    navigateTo({
      url: `/${settings.homePath}`
    })
  }
}

/** 计算标题颜色透明度 */
export const getOpacity = (scrollTop: number): number => {
  if (scrollTop >= 50) return 1
  return Number((scrollTop / 50).toFixed(2))
}
