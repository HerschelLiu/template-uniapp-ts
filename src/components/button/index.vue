<template>
  <button
    :open-type="openType"
    :disabled="disabled"
    :form-type="formType"
    :loading="loading"
    :hover-class="hoverClass ? 'hover' : ''"
    :class="className"
    :style="customStyle"
    @click="handleClick"
    @getphonenumber="handleGetphonenumber"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

import { computed } from 'vue'

defineOptions({
  name: 'CompButton',
  virtualHost: true
})

const props = defineProps({
  openType: {
    type: String as PropType<UniHelper.ButtonOpenType>,
    default: ''
  },
  /** 是否镂空 */
  hollow: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  formType: {
    type: String as PropType<UniHelper.ButtonFormType>,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  hoverClass: {
    type: Boolean,
    default: true
  },
  styleName: {
    type: String,
    default: 'default'
  },
  customStyle: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['click', 'getphonenumber'])

const className = computed(() => {
  const names = ['component-button']
  names.push(`component-button-${props.styleName}`)
  if (props.hollow) names.push('component-button-hollow')

  return names
})

const handleClick = (e: any) => emits('click', e)
const handleGetphonenumber = (e: any) => emits('getphonenumber', e)
</script>

<style lang="scss" scoped>
.component-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
  padding: 0;
  border: 0;
  border-radius: 40rpx;
  background-color: transparent;
  color: #fff;
  font-size: 32rpx;
  line-height: 44rpx;

  &::after {
    content: none;
  }

  &-default {
    @include gradient;

    &.hover {
      opacity: 0.9;
    }
  }

  &-hollow {
    border: 1px solid #979797;
    background: none;
    color: #000;
  }

  /* 禁用时 */
  &-disabled {
    border: 0 !important;
    border-color: none !important;
    background: linear-gradient(130deg, #e4e4e4 0, #d6d6d9 100%) !important;
    color: #fff !important;

    &.hover {
      opacity: 1 !important;
    }
  }

  &-error {
    background-color: #f00000;
    color: #fff;

    &.hover {
      opacity: 1 !important;
    }
  }

  &-info {
    background-color: #f7f7f7;
    color: #999;

    &.hover {
      opacity: 1 !important;
    }
  }

  &-success {
    background-color: #00913a;
    color: #fff;

    &.hover {
      opacity: 1 !important;
    }
  }

  &-primary {
    background-color: #4793fd;
    color: #fff;

    &.hover {
      opacity: 1 !important;
    }
  }

  &-warning {
    background-color: #ff730d;
    color: #fff;

    &.hover {
      opacity: 1 !important;
    }
  }
}
</style>
