<template>
  <web-view :src="url" />
</template>

<script lang="ts" setup>
const url = ref('')

onLoad(async options => {
  if (options) {
    try {
      const src = await useValidateArgs<string>(options, 'url')
      url.value = decodeURIComponent(src)
    } catch {
      navigateBack()
    }
  }
})
</script>
