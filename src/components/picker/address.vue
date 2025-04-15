// /** * 地址选择器 * 多行例子 * interface ResponseGetThreeAreaTree { * areaId: string * /** 地区编码 */ * areaCode: string * /** 地区名称 */ *
areaName: // string * /** 地区列表 */ * areaList?: ResponseGetThreeAreaTree[] } */
<!--<template>
  <view class="view" @click="handleShowModal('showPicker')">
    <up-input
      :model-value="selectedText"
      readonly
      :placeholder="placeholder"
      border="none"
      font-size="28rpx"
      color="#333"
      :input-align="inputAlign"
    />
  </view>

  <up-picker
    ref="RefPicker"
    title="请选择"
    :show="modalList.showPicker"
    :columns="areaTree"
    key-name="areaName"
    :loading="list.loading"
    @close="handleCloseModal"
    @cancel="handleCloseModal"
    @confirm="handleConfirm"
    @change="handleChange"
  />
</template>

<script lang="ts" setup>
import type { ResponseGetThreeAreaTree } from '@/api/modules/system/area'

import { isHaveValue } from 'validing'
import { computed, onMounted, ref, watch } from 'vue'

import { getThreeAreaTree } from '@/api/modules/system/area'
import { useFindNode, useFindNodeWithAncestors, useGetObjMaxDepth } from '@/hooks/useArray'
import { useAfterList, useList, useBeforeList } from '@/hooks/useList'
import { useModal } from '@/hooks/useModal'

interface Props {
  placeholder?: string
  inputAlign?: 'left' | 'center' | 'right'
}
interface Emits {
  'update:modelValue': []
  change: [ResponseGetThreeAreaTree[]]
}
interface PickerConfirmResult {
  indexs: { [key: number]: number }[]
  value: ResponseGetThreeAreaTree[]
  values: ResponseGetThreeAreaTree[]
}
interface PickerChange extends Omit<PickerConfirmResult, 'indexs'> {
  columnIndex: number
  index: number
  indexs: number[]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  inputAlign: 'left'
})
const emit = defineEmits<Emits>()

const value = defineModel<string>({ required: true })

const selectedText = computed(() =>
  selected.value
    .map(item => item?.areaName)
    .filter(item => isHaveValue(item))
    .join(',')
)
/** 地区选择器默认数据 */
const areaTree = computed(() => {
  const tree = [] as ResponseGetThreeAreaTree[][]
  if (list.items.length) {
    const firstObj = selected.value[0] ?? list.items[0]
    const maxDepth = useGetObjMaxDepth(firstObj, 'areaList')
    for (let index = 0; index < maxDepth; index++) {
      let theTree = [] as ResponseGetThreeAreaTree[]
      if (index === 0) {
        theTree = [...list.items]
      } else {
        const preNode = useFindNode(list.items, selected.value[index - 1]?.areaCode ?? tree[index - 1][0].areaCode, 'areaCode', 'areaList')
        theTree = preNode?.areaList ?? []
      }

      tree.push(theTree)
    }
  }

  return tree
})

const RefPicker = ref()
let list = useList<null, ResponseGetThreeAreaTree>(null)
const selected = ref<(ResponseGetThreeAreaTree | null)[]>([])

const { modalList, handleShowModal, handleCloseModal } = useModal({
  showPicker: false
})

watch(
  () => [value.value, list.items],
  ([val, _]) => {
    if (val) {
      const { ancestors, node } = useFindNodeWithAncestors(list.items, val as string, 'areaCode', 'areaList')
      selected.value = [...ancestors, node].filter(item => isHaveValue(item))
    }
  }
)

onMounted(async () => {
  listArea()
})

const listArea = async () => {
  await useBeforeList(list)
  const { data } = await getThreeAreaTree()
  list = useAfterList(list, { records: data })
}

const handleChange = ({ value: pickerValue, indexs, columnIndex }: PickerChange) => {
  selected.value[columnIndex] = pickerValue[columnIndex]

  selected.value = pickerValue.map((item, index) => (index <= columnIndex ? item : null)).filter(item => isHaveValue(item))
  const _indexs = indexs.map((num, i) => (i <= columnIndex ? num : 0))
  RefPicker.value?.setIndexs(_indexs)
}

const handleConfirm = ({ value: pickerValue }: PickerConfirmResult) => {
  selected.value = pickerValue
  value.value = pickerValue[pickerValue.length - 1]?.areaCode
  emit('change', pickerValue)

  handleCloseModal()
}
</script>
-->
