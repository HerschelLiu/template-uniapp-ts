<template>
  <!-- titlebar start -->
  <view v-if="showTitleBar" class="component" :style="style" @touchmove.stop="">
    <!-- 背景色彩 start -->
    <view class="background" :style="backgroundStyle" />
    <!-- 背景色彩 end -->

    <!--标题 start -->
    <view v-if="title" class="title" :style="titleStyle">{{ title }}</view>
    <!--标题 end -->

    <!--返回按钮 start -->
    <view v-if="!isTabBar() && showBackButton && canBack" class="button" :style="buttonStyle" @click="handleBack">
      <up-icon name="arrow-left" :color="backBtnColor" size="24" />
    </view>
    <view v-else-if="!isTabBar() && showBackButton && !canBack" class="button" :style="buttonStyle" @click="handleBackHome">
      <up-icon name="home-fill" :color="backBtnColor" size="24" />
    </view>
    <!--返回按钮 end -->
  </view>
  <!-- titlebar end -->

  <!--slot start -->
  <slot />
  <!--slot end -->
</template>

<script lang="ts" setup>
interface Props {
  /** 整体是否展示 */
  show?: boolean
  title?: string
  /** 是否展示标题透明度 */
  showTitleOpacity?: boolean
  background?: string
  opacity?: number
  backBtnColor?: string
  titleColor?: string
  titleOpacity?: number
  showBackButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  background: 'transparent',
  opacity: 1,
  backBtnColor: '#000',
  titleColor: '#333',
  titleOpacity: -1,
  showBackButton: true,
  showTitleOpacity: true
})

const showTitleBar = ref(true)

const style = computed(() => {
  return useStyle({
    paddingTop: useUnit(settings.systemInfo.statusBarHeight!, 'px'),
    height: useUnit(settings.titleBarHeight, 'px')
  })
})

const titleStyle = computed(() => {
  return useStyle({
    opacity: props.showTitleOpacity ? '1' : `${props.titleOpacity === -1 ? props.opacity : props.titleOpacity}`,
    color: props.titleColor,
    height: useUnit(settings.titleBarHeight - settings.systemInfo.statusBarHeight!, 'px')
  })
})

const backgroundStyle = computed(() => {
  return useStyle({
    background: props.background || '',
    opacity: `${props.opacity}`
  })
})

const buttonStyle = computed(() => {
  const menuButton = settings.menuButton

  return useStyle({
    width: useUnit(menuButton.height, 'px'),
    height: useUnit(menuButton.height, 'px'),
    top: menuButton.top ? useUnit(menuButton.top, 'px') : '50%',
    transform: `translateY(${menuButton.top ? 0 : '-50%'})`
  })
})

const canBack = computed(() => {
  const prevPage = getThePage(-1)
  return !!prevPage
})

const handleBack = () => {
  const Page = getThePage()
  if (Page.$vm.handleBack) {
    Page.$vm.handleBack()
    return
  }
  navigateBack()
}

const handleBackHome = () => {
  navigateTo({ url: `/${settings.homePath}` })
}
</script>

<style lang="scss" scoped>
// titlebar
.component {
  position: fixed;
  z-index: 111;
  inset: 0 0 auto;
  box-sizing: border-box;

  .background {
    position: absolute;
    z-index: -1;
    inset: 0;
    background: #fff;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 34rpx;
  }

  .button {
    display: flex;
    position: absolute;
    left: 10rpx;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    width: 44rpx;
    height: 44rpx;
    border-radius: 50%;
    color: #333;
  }
}
</style>
