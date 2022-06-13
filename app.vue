<template lang="pug">
div#app(class="w-full h-screen overflow-hidden bg-grey")
  the-header(ref="header")
  main#app-main(class="max-w-90 mx-auto py-5 text-black" :style="{ height }")
    nuxt-page
</template>

<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'

defineNuxtComponent({
  TheHeader
})

const header = ref<typeof TheHeader | null>(null)
const height = ref<string>('0px')

function setMainHeight(el: typeof TheHeader | null): void {
  const headerHeight = el?.$el.getBoundingClientRect().height + 'px'
  height.value = `calc(100% - ${headerHeight})`
}

onMounted(() => {
  setMainHeight(header.value)
  window.addEventListener('resize', () => {
    setMainHeight(header.value)
  })
})
</script>