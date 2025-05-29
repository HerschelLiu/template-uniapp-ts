interface User {
  accessToken: string
  phone: string
  isLogin: boolean
  userId: string
}

export const useUserStore = defineStore(
  'user',
  () => {
    const assets: User = {
      accessToken: '',
      phone: '',
      isLogin: false,
      userId: ''
    }
    const state = reactive<User>({ ...assets })

    const clear = (notReset?: string[]) => {
      useResetObject(state, assets, notReset)
    }

    return {
      ...toRefs(state),
      clear
    }
  },
  {
    persist: true
  }
)
