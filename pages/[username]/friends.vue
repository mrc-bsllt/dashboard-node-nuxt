<template lang="pug">
main(class="relative")
  h3(class="text-22 font-semibold uppercase") 
    | Amici ({{ friends.length }})
  section(class="friends__wrapper")
    div(v-if="!friends.length" class="no-friends__wrapper absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2")
      img(src="@/assets/svg/sad.svg" alt="sad-icon" width="200" height="200" class="inline-block transition-enter")
</template>

<script setup lang="ts">
import type { User } from '@/types/user'

const { data:friends } = await useAsyncData<User[]>('friends', () => {
  const user_id = useCookie('user_id').value
  const token = useCookie('token').value
  return $fetch(`http://localhost:8080/api/user/${user_id}/friends`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
})
</script>