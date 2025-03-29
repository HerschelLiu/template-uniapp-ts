
const compatibleAPIs = {
  getAccountInfoSync(): UniApp.AccountInfo {
    let result = {} as UniApp.AccountInfo
    // #ifdef MP-WEIXIN || MP-ALIPAY || MP-QQ || MP-KUAISHOU || MP-JD
    result = uni.getAccountInfoSync();
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
      width: 0,
      height: 0
    }
    // #endif

    return result
  },

  // authorize: (options: UniApp.AuthorizeOptions) => {
  //   // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-LARK || MP-QQ || MP-KUAISHOU || MP-HARMONY
  //   if (uni.authorize) return uni.authorize(options)
  //   // #endif

  //   // #ifdef WEB
  //   if (!uni.authorize) {
  //     async function authorize() {
  //       try {
  //         const permission = await navigator.permissions.query({ name: Authorize[options.scope] })
  //         console.log(permission, 1212);
  //       } catch (error) {
  //         console.log(error, 1212);
  //       }
  //       return new Promise<void>(async (resolve, reject) => {
  //         console.log(1);
          
  //         if (!navigator.permissions?.query) { 
  //           return reject()
  //         }

  //         const permission = await navigator.permissions.query({ name: Authorize[options.scope] })
  //         console.log(permission, 1212);
          
  //         const { state } = permission
  //         if (state === 'granted') {
  //           resolve()
  //           console.log(111);
            
  //         } else if (state === 'prompt') {
  //           permission.addEventListener('change', () => {
  //             // console.log(222);
  //             // authorize()
  //           })
  //         } else if (state === 'denied') {
  //           reject()
  //         }
  //       })
  //     }
      
  //     return authorize
  //   }
  //   // #endif
  // }
}

const upp = new Proxy(uni, {
  get(target, prop: keyof UniApp.Uni) {
    // 优先使用兼容实现
    if (prop in compatibleAPIs) {
      return compatibleAPIs[prop as keyof typeof compatibleAPIs];
    }
    
    // 原生方法存在则直接返回
    if (target[prop]) {
      return target[prop];
    }
    
    // 方法不存在时的默认处理
    return function() {
      console.warn(`[upp兼容警告] ${String(prop)} 方法在当前平台不可用`);
      return null;
    };
  }
}) as UniApp.Uni;

export default upp;
