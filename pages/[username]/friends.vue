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
    transition(name="slide-down" mode="out-in")
      div(v-if="showList" class="result__wrapper absolute top-[120%] left-0 w-50 h-auto bg-black/[.7] rounded-bl-[10px] rounded-br-[10px]")
        div(v-if="!searchResults.length" class="loader py-10 text-center")
          hollow-dots-spinner(:animation-duration="800" 
                              :dot-size="15" 
                              :dots-num="3" 
                              color="#BEBEBE"
                              class="inline-block")
  section(class="friends__wrapper")
    div(v-if="!friends.length" class="no-friends__wrapper absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2")
      img(src="@/assets/svg/sad.svg" alt="sad-icon" width="200" height="200" class="inline-block transition-enter")
</template>

<script setup lang="ts">
import { HollowDotsSpinner } from 'epic-spinners'
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

const showList = ref<boolean>(false)
const searchResults = ref<User[]>([])

let bouncing: any = null
function onDigit($event: Event) {
  showList.value = true
  clearTimeout(bouncing)
  bouncing = setTimeout(() => {
    const value = ($event.target as HTMLInputElement).value
    fetchFriends(value)
  }, 500)
}

async function fetchFriends(value: string) {
  if(!value) {
    showList.value = false
  } else {
    const token = useCookie('token').value
    const users = await $fetch(`http://localhost:8080/api/users/${value}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    console.log(users)
  }
}
</script>