<template>
  <image
    :src="imgSrc"
    :mode="mode"
    :lazy-load="lazyLoad"
    :show-menu-by-longpress="showMenuByLongpress"
    class="component"
    :style="useStyle({ borderRadius })"
    @click="(e: any) => emit('click', e)"
  >
    <slot />
  </image>
</template>

<script lang="ts" setup>
interface Props {
  mode: UniHelper.ImageMode
  src: string
  lazyLoad: boolean
  showMenuByLongpress: boolean
  borderRadius: string
  cos: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'aspectFill',
  src: '',
  lazyLoad: true,
  showMenuByLongpress: false,
  borderRadius: '0',
  cos: false
})

const emit = defineEmits(['click'])

const imgSrc = computed(() => (props.src ? useCosImage(props.src, props.cos) : props.src))
</script>

<style lang="scss" scoped>
.component {
  display: block;
  @include width-height;
  position: relative;
  overflow: hidden;
}
</style>
