<template lang="pug">
div#app(class="w-full h-screen overflow-hidden bg-grey")
  the-header(ref="header")
  main#app-main(class="relative flex flex-row justify-start items-stretch flex-nowrap text-black" :style="{ height }")
    the-aside(class="absolute top-0 left-0")
    nuxt-page(class="ml-[50px] p-5 sm:p-10" :style="{ width }")
</template>

<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheAside from '@/components/TheAside.vue'

defineNuxtComponent({
  TheHeader,
  TheAside
})

const header = ref<typeof TheHeader | null>(null)
const height = ref<string>('0px')

const width = computed((): string => {
  return 'calc(100% - 50px)'
})

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