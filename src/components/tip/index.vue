<template>
  <up-overlay :show="show" :mask-click-able="maskClickAble" @click="handleMaskClick">
    <view class="main">
      <view class="modal" @click.stop>
        <view class="title">{{ title }}</view>
        <scroll-view scroll-y class="content">
          <view>{{ content }}</view>
        </scroll-view>
      </view>

      <comp-image src="closeHomeBtn.png" class="close" @click.stop="show = false" />
    </view>
  </up-overlay>
</template>

<script lang="ts" setup>
interface Props {
  title: string
  content?: string
  maskClickAble: boolean
  canMaskClose: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '提示',
  maskClickAble: true,
  canMaskClose: true
})

const emit = defineEmits(['update:modelValue', 'close'])

const show = defineModel<boolean>()

// 点击遮罩层
const handleMaskClick = () => {
  if (!props.maskClickAble) return
  if (props.canMaskClose) show.value = false
  emit('close')
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .modal {
    box-sizing: border-box;
    width: 622rpx;
    padding: 18rpx 54rpx 74rpx;
    border-radius: 24rpx;
    background: #fff;

    .title {
      padding: 30rpx 0;
      color: #000;
      font-size: 36rpx;
      font-weight: bold;
      text-align: center;
    }

    .content {
      height: 300rpx;
      color: $uni-text-color;
      font-size: 36rpx;
      line-height: 50rpx;
      text-align: justify;
    }
  }

  .close {
    display: block;
    width: 60rpx;
    height: 60rpx;
    margin-top: 50rpx;
  }
}
</style>
