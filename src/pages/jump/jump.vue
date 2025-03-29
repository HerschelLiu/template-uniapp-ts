<template />

<script lang="ts" setup>
onLoad(options => {
  const prevPage = getThePage(-1)
  const query = Object.assign({}, options, useArgsStrToObj(decodeURIComponent(options?.scene)))
  const { homePath } = settings
  const page = Reflect.get(query, 'page')

  try {
    const fullPath = `${page.startsWith('/') ? '' : '/'}${page}?${useArgsObjToStr(query)}`

    if (isTabBar(fullPath)) {
      navigateTo({ url: fullPath })
    } else {
      redirectTo({ url: fullPath })
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
