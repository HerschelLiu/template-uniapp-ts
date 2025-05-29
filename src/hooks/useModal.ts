import { reactive, ref } from 'vue'

type ModalName = `show${Cap}`

interface ModalList {
  toast?: string
  [key: ModalName]: boolean
}

/** 弹窗 */
export function useModal(list: ModalList) {
  /** 是否显示弹窗 */
  const showModal = ref(false)

  /** 弹窗列表 */
  const modalList = reactive(list)

  /** 目标操作 */
  const callbackType = ref('')

  /** 显示弹窗 */
  const handleShowModal = (target: ModalName, type?: string) => {
    callbackType.value = type || ''
    Reflect.set(modalList, target, true)
    showModal.value = true
  }

  /** 关闭弹窗 */
  const handleCloseModal = () => {
    for (const key in modalList) {
      Reflect.set(modalList, key, false)
    }
    showModal.value = false
  }

  return {
    /** 是否显示弹窗 */
    showModal,
    /** 弹窗列表 */
    modalList,
    /** 目标操作 */
    callbackType,
    /** 显示弹窗 */
    handleShowModal,
    /** 关闭弹窗 */
    handleCloseModal
  }
}
