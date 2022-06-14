<template lang="pug">
header#header(class="relative py-4 px-6 bg-black text-grey border-b border-solid border-gold")
  nuxt-link(to="/" class="absolute top-1/2 left-[24px] -translate-y-1/2")
    icon(name="home")
  ul(class="header__list w-full h-full flex flex-row justify-end items-center flex-nowrap") 
    template(v-if="!get_show_logout")
      li.px-2
        nuxt-link(to="/auth/login")
          | Login 
      li.pl-2
        nuxt-link(to="/auth/signup")
          | Signup 
    li.pl-2(v-else)
      button(@click="logout")
        | logout 
</template>

<script setup lang="ts">
import { useHeader } from '@/store/header'
import Icon from '@/components/commons/Icon.vue'
defineNuxtComponent({
  Icon
})

const headerStore = useHeader()
const { get_show_logout } = toRefs(headerStore)

function logout() {
  useCookie('token').value = undefined
  useCookie('user_id').value = undefined
  navigateTo('/auth/login')
}
</script>