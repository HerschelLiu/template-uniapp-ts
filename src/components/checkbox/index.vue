<template>
  <label class="label">
    <view class="checkbox">
      <comp-image v-if="checked" src="./images/icon-checkbox-active.png" class="checkbox-icon" />
      <comp-image v-else src="./images/icon-checkbox.png" class="checkbox-icon" />
    </view>
  </label>
</template>

<script lang="ts" setup>
defineProps({
  checked: {
    type: Boolean,
    default: false,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.label {
  position: relative;

  .hide-checkbox {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .checkbox {
    display: flex;
    align-items: center;

    &-icon {
      display: block;
      width: 32rpx;
      height: 32rpx;
    }

    &-text {
      margin-left: 8rpx;
      color: $uni-text-color-grey;
      font-size: 28rpx;
    }
  }
}
</style>
