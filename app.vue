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
import { useUser } from '@/store/user'
import type { User } from '@/types/user'
import { useHeader } from '@/store/header'
const { set_user } = useUser()
const { get_refresh_data } = toRefs(useUser())

const { data, refresh } = await useAsyncData<User>('index', (): any => {
  const user_id = useCookie('user_id')

  if(user_id.value) {
    return $fetch('http://localhost:8080/api/user/' + user_id.value)
  }
})

const { set_show_logout } = useHeader()
const { get_show_logout } = toRefs(useHeader())

if(data.value) {
  set_user(data.value)
  set_show_logout(true)
}

watch(get_show_logout, async (newValue) => {
  if(newValue) {
    await refresh()
    set_user(data.value)
  }
})
watch(get_refresh_data, async (newValue) => {
  if(newValue) {ù
    await refresh()
    set_user(data.value)
  }
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