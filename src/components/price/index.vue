<template>
  <text class="price">
    <!--type start-->
    <text v-if="type" class="type">{{ type }}</text>
    <!--type end-->

    <!--sign start-->
    <text v-if="showSign && !isNaN(pix)" class="sign" :style="signStyle">￥</text>
    <!--sign end-->

    <!--number start-->
    <text class="number">
      {{ int }}
      <text v-if="decimal" class="decimal">{{ decimal }}</text>
    </text>
    <text v-if="unit" class="unit">{{ unit }}</text>
    <!--number end-->
  </text>
</template>

<script lang="ts" setup>
interface Props {
  /** 是否显示符号 */
  showSign: boolean
  /** 价格 */
  price: number | string
  /** 前置符号 */
  type?: string
  /** 是否显示小数部分 */
  double: boolean
  /** 后置单位 */
  unit?: string
  /** 价格单位 */
  priceUnit: 'fen' | 'yuan'
  /** 符号样式 */
  signStyle?: string
}

const props = withDefaults(defineProps<Props>(), {
  showSign: true,
  price: undefined,
  double: false,
  priceUnit: 'yuan'
})

/** 价格 */
const pix = computed(() => {
  return props.priceUnit === 'fen' ? Number(props.price) / 100 : Number(props.price)
})

/** 整数部分 */
const int = computed(() => {
  return !isNaN(pix.value) ? pix.value.toFixed(2).split('.')[0] : '--'
})

/** 小数部分 */
const decimal = computed(() => {
  if (isNaN(pix.value)) {
    return ''
  }
  let num: string = pix.value.toFixed(2).split('.')[1]
  if (!props.double) {
    if (Number(num) === 0) {
      return ''
    }
    if (Math.floor(Number(num) / 10) === Number(num) / 10) {
      num = (Number(num) / 10).toString()
    }
  }
  return '.' + num
})
</script>

<style lang="scss" scoped>
.price {
  display: inline-flex;
  align-items: baseline;
  justify-content: flex-start;
}

.sign {
  color: $uni-text-color;
  font-size: 26rpx;
  line-height: 32rpx;
}

.number {
  color: $uni-text-color;
  font-size: 36rpx;
}
</style>
