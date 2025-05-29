<template>
  <view class="view" @click="handleShowModal('showPicker')">
    <up-input :model-value="selectedText" readonly :placeholder="placeholder" border="none" font-size="28rpx" color="#333" />
  </view>

  <nut-calendar
    v-if="modalList.showPicker"
    v-model:visible="modalList.showPicker"
    :default-value="defaultValue"
    type="range"
    @close="handleCloseModal"
    @choose="handleConfirm"
  />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

import { useModal } from '@/hooks/useModal'
import { isHaveValue } from '@/hooks/useValidate'

interface Props {
  placeholder?: string
  /** 默认值 日期字符串 */
  defaultValue?: string[]
}
interface Emits {
  change: [[string, string]]
}

interface PickerDate {
  /** 年 */
  0: string
  /** 月 */
  1: string
  /** 日 */
  2: string
  /** 完整日期 */
  3: string
  /** 星期几 */
  4: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  defaultValue: () => []
})
const emit = defineEmits<Emits>()

const selected = ref<PickerDate[]>([])
const selectedText = computed(() => selected.value.map(item => item[3]).join(' ~ '))

const { modalList, handleShowModal, handleCloseModal } = useModal({
  showPicker: false
})

watch(
  () => props.defaultValue,
  val => {
    if (val && val.every(item => isHaveValue(item))) {
      selected.value = val.map(item => {
        const [Y, M, D] = item.split('-')

        return {
          0: Y,
          1: M,
          2: D,
          3: item,
          4: ''
        }
      })
    }
  }
)

const handleConfirm = (param: [PickerDate, PickerDate]) => {
  selected.value = param
  handleCloseModal()
  emit('change', [param[0][3], param[1][3]])
}
</script>

<style lang="scss" scoped>
.search {
  padding: 0 22rpx;
}

.view {
  width: 100%;
}
</style>
