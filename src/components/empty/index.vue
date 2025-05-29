<template>
  <up-empty :icon="src" :text="text" textColor="#666" :textSize="textSize" :width="width" :height="height" :marginTop="marginTop">
    <slot />
  </up-empty>
</template>

<script lang="ts" setup>
interface Props {
  text: string
  marginTop: string
  icon: string
  width: string
  height: string
  textSize: string
}

const props = withDefaults(defineProps<Props>(), {
  text: '暂无数据',
  marginTop: useUnit(42),
  icon: '/static/img-none.png',
  width: useUnit(404),
  height: useUnit(330),
  textSize: useUnit(28)
})

const src = useCosImage(props.icon)
</script>
