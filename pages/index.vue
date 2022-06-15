<template lang="pug">
main 
  h1 BENTORNATO 
    span(class="underline italic") {{ user.username }}
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
const { data, refresh } = await useAsyncData<User>('index', (): any => {
  const user_id = useCookie('user_id')

  if(user_id.value) {
    return $fetch('http://localhost:8080/api/user/' + user_id.value)
  }
})
const user = computed(() => data.value)
</script>