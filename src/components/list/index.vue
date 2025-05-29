<template>
  <view class="component" :class="{ 'safe-bottom': safeBottom }">
    <!-- gropu start -->
    <slot name="group" />
    <!-- gropu end -->

    <!--list start -->
    <slot name="list" />
    <!--list end -->

    <!--text start -->
    <view v-if="!list.haveAny" class="list-tip">
      <comp-empty :width="noneWidth" :height="noneHeight" :text="tip" :icon="noneImage" />
    </view>

    <template v-if="list.showText">
      <up-loading-icon
        v-if="!isNoMore && list.loading"
        text="加载中"
        text-size="12"
        color="#666"
        mode="semicircle"
        size="12"
      />
      <view v-if="isNoMore" class="list-tip">没有更多数据了~</view>
    </template>
    <view v-if="list.reGet" class="list-tip" @click="handleReGetList">
      <slot v-if="$slots.reget" name="reget" />
      <template v-else>点击重新加载数据</template>
    </view>
    <!--text end -->

    <!--list start -->
    <slot v-if="!list.loading && !list.items?.length" name="button" />
    <!--list end -->
  </view>
</template>

<script lang="ts" setup>
interface Props {
  list: List
  noneImage?: string
  /** 占位图宽度 */
  noneWidth?: number
  /** 占位图高度 */
  noneHeight?: number
  /** 是否使用安全底部边距 */
  safeBottom?: boolean
  tip?: string
}
const props = withDefaults(defineProps<Props>(), {
  list: () =>
    ({
      total: 0,
      pageCount: 0,
      haveAny: true,
      loading: false,
      haveMore: true,
      reGet: false,
      showText: true,
    } as List),
  safeBottom: true,
})
const emit = defineEmits<{ getlist: [] }>()

const isNoMore = computed(
  () => props.list.haveAny && !props.list.haveMore && props.list.pageCount >= 1
)

/** 重新获取列表 */
const handleReGetList = () => {
  emit('getlist')
}
</script>

<style lang="scss" scoped>
.component {
  display: template;

  &.safe-bottom {
    @include safe(padding-bottom, 40rpx);
  }

  .list-tip {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    min-height: 100rpx;
    margin-top: 10rpx;
    padding: 30rpx 0;
    color: #666;
    font-size: 24rpx;
  }

  .loading {
    box-sizing: border-box;
    height: 140rpx;
    padding: 50rpx 0;
  }

  .none {
    display: template;
    width: 400rpx;
    height: 364rpx;
    margin: 60rpx 0 50rpx -20rpx;
  }
}
</style>
