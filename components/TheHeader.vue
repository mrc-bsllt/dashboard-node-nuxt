<template lang="pug">
header#header(class="py-3 px-6 bg-black text-grey border-b border-solid border-gold")
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
const headerStore = useHeader()
const { get_show_logout } = toRefs(headerStore)

function logout() {
  useCookie('token').value = undefined
  useCookie('user_id').value = undefined
  navigateTo('/auth/login')
}
</script>