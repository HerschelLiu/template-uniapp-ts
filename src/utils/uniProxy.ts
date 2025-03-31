const compatibleAPIs = {
  getAccountInfoSync(): UniApp.AccountInfo {
    let result = {} as UniApp.AccountInfo
    // #ifdef MP-WEIXIN || MP-ALIPAY || MP-QQ || MP-KUAISHOU || MP-JD
    result = uni.getAccountInfoSync()
    // #endif

    // #ifdef MP-BAIDU || MP-TOUTIAO || MP-LARK || APP || WEB || MP-HARMONY
    result = {
      miniProgram: {
        appId: '',
        envVersion: 'release',
        version: '1.0.0'
      },
      plugin: {
        appId: '',
        version: '1.0.0'
      }
    }
    // #endif

    return result
  },

  getMenuButtonBoundingClientRect(): UniApp.GetMenuButtonBoundingClientRectRes {
    let result = {} as UniApp.GetMenuButtonBoundingClientRectRes
    // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
    result = uni.getMenuButtonBoundingClientRect()
    // #endif

    // #ifdef APP || WEB || MP-HARMONY
    result = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: 87,
      height: 32
    }
    // #endif

    return result
  }
}

const upp = new Proxy(uni, {
  get(target, prop: keyof UniApp.Uni) {
    // 优先使用兼容实现
    if (prop in compatibleAPIs) {
      return compatibleAPIs[prop as keyof typeof compatibleAPIs]
    }

    // 原生方法存在则直接返回
    if (typeof uni[prop] === 'function') {
      return target[prop]
    }

    // 方法不存在时的默认处理
    return function () {
      console.warn(`[upp兼容警告] ${String(prop)} 方法在当前平台不可用`)
      return null
    }
  }
}) as UniApp.Uni

export default upp
