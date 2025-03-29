<script setup lang="ts">
onLaunch(() => {
  useAppLaunch()
})

onShow(() => {
  useAppShow()
})
</script>

<style lang="scss">
@import 'uview-plus/index';
@import 'nutui-uniapp/styles/index';

page {
  --nut-primary-color: #4793fd;
  color: $custom-color-font;
  background-color: #f8f8f8;
}
</style>
