/** * 银行选择器 * 单行例子 * interface ResponseListBank { bankCode: string bankId: string bankName: string bankNameShort: string bankNumber: string }
<!--<template>
  <view class="view" @click="handleShow">
    <up-input
      :model-value="selected[0].bankName"
      readonly
      :placeholder="placeholder"
      :input-align="inputAlign"
      border="none"
      font-size="28rpx"
      color="#333"
    />
  </view>

  <up-picker
    ref="pickerRef"
    title="开户行"
    :show="show"
    :columns="[list.items]"
    key-name="bankName"
    :loading="list.loading"
    @change="handleChange"
    @close="handleMaskClick"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <template #toolbar-bottom>
      <view class="search">
        <up-search
          v-model="list.query.bankName"
          placeholder="请输入"
          clearabled
          font-size="28rpx"
          color="#333"
          show-action
          close-on-click-overlay
          @search="handleSearch"
          @confirm="handleSearch"
          @custom="handleSearch"
          @clear="handleSearch"
        />
      </view>
    </template>
  </up-picker>
</template>

<script lang="ts" setup>
import type { RequestListBank, ResponseListBank } from '@/api/modules/common'

import { ref, watch, nextTick } from 'vue'

import { listBank } from '@/api/modules/common'
import { useAfterList, useInitList, useList, useBeforeList } from '@/hooks/useList'
import { useValue } from '@/hooks/useObject'

interface Props {
  placeholder?: string
  disabled?: boolean
  selected?: Partial<ResponseListBank>
  inputAlign: 'left' | 'center' | 'right'
}

export interface PickerConfirmResult {
  indexs: { [key: number]: number }[]
  value: Partial<ResponseListBank>[]
  values: ResponseListBank[]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择开户行',
  disabled: false,
  selected: () => ({}),
  inputAlign: 'left'
})

const emit = defineEmits(['cancel', 'close', 'change'])

// #region ref
const pickerRef = ref()
const show = ref(false)
let list = useList<RequestListBank, ResponseListBank>({
  bankName: '',
  pageSize: 5
})
const selected = ref<Partial<ResponseListBank>[]>([{ bankName: '' }])
// #endregion

// #region 监听
watch(
  () => props.selected,
  val => {
    if (Object.keys(val).length) {
      selected.value = [val]
    }
  },
  { immediate: true }
)

watch(
  () => show.value,
  val => {
    if (val) {
      list.query.bankName = ''
      handleSearch()
    }
  }
)
// #endregion

// #region 方法
const handleShow = () => {
  if (props.disabled) return
  show.value = true
}

const getList = async () => {
  await useBeforeList(list)
  const { data } = await listBank(useValue(list.query))
  list = useAfterList(list, data)
  nextTick(() => {
    pickerRef.value?.setIndexs([0])
  })
}

const handleSearch = () => {
  list = useInitList(list)
  getList()
}

const handleChange = ({ index }: { index: number }) => {
  if (list.items.length - 1 === index) getList()
}

// 取消
const handleCancel = () => {
  show.value = false
  emit('cancel')
}

// 点击遮罩层
const handleMaskClick = () => {
  show.value = false
  emit('close')
}

const handleConfirm = (e: PickerConfirmResult) => {
  selected.value = e.value
  emit('change', e.value[0])
  show.value = false
}
// #endregion
</script>

<style lang="scss" scoped>
.search {
  padding: 0 22rpx;
}

.view {
  width: 100%;
}
</style>
-->
