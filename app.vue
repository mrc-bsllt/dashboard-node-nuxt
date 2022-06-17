<template lang="pug">
div#app(class="w-full h-screen overflow-hidden bg-grey")
  the-header(ref="header")
  main#app-main(class="relative flex flex-row justify-start items-stretch flex-nowrap text-black" :style="{ height }")
    the-aside(ref="aside" class="absolute top-0 left-0")
    nuxt-page(class="p-5 sm:p-10" :style="{ width, marginLeft }")
</template>

<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheAside from '@/components/TheAside.vue'

defineNuxtComponent({
  TheHeader,
  TheAside
})

const header = ref<typeof TheHeader | null>(null)
const aside = ref<typeof TheAside | null>(null)
const height = ref<string>('0px')
const width = ref<string>('0px')
const marginLeft = ref<string>('0px')

function setMainHeight(el: typeof TheHeader | null): void {
  const headerHeight = el?.$el.getBoundingClientRect().height + 'px'
  height.value = `calc(100% - ${headerHeight})`
}
function setMainWidth(el: typeof TheAside | null): void {
  const asideWidth = el?.$el.getBoundingClientRect().width + 'px'
  marginLeft.value = asideWidth
  width.value = `calc(100% - ${asideWidth})`
}

onMounted(() => {
  setMainHeight(header.value)
  setMainWidth(aside.value)
  window.addEventListener('resize', () => {
    setMainHeight(header.value)
    setMainWidth(aside.value)
  })
})
</script>