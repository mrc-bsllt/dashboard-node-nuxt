<template lang="pug">
main(class="relative")
  h3(class="text-22 font-semibold uppercase") 
    | Amici ({{ friends.length }})
  div(class="search__wrapper relative mt-10")
    img(src="@/assets/svg/search.svg" alt="search-icon" width="30" height="30" class="absolute bottom-0 left-0")
    input(type="text" 
          placeholder="Cerca nuovi amici" 
          class="w-50 pl-8 bg-transparent border-b border-solid border-black focus:outline-none"
          @input="onDigit")
    div(class="result__wrapper")
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

let bouncing: any = null
function onDigit($event: Event) {
  clearTimeout(bouncing)
  bouncing = setTimeout(() => {
    const value = ($event.target as HTMLInputElement).value
    fetchFriends(value)
  }, 500)
}
function fetchFriends(value: string) {
  console.log(value)
}
</script>