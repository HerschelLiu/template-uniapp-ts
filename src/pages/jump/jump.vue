<template />

<script lang="ts" setup>
onLoad(async options => {
  const prevPage = getThePage(-1)
  const { homePath } = settings

  try {
    const query = await useFormatQuery(options)
    const page: string | null = Reflect.get(query, 'page')

    if (page) {
      Reflect.deleteProperty(query, 'page')
      const fullPath = `${usePath(page, true, '')}${useArgsObjToStr(query)}`

      if (isTabBar(fullPath)) {
        navigateTo({ url: fullPath })
      } else {
        redirectTo({ url: fullPath })
      }
    }
  } catch (error) {
    console.log(error)
    upp.showToast({
      icon: 'none',
      title: '跳转有误'
    })

    if (prevPage) {
      navigateBack()
    } else {
      navigateTo({ url: `/${homePath}` })
    }
  }
})
</script>
