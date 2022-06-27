<template lang="pug">
main(class="relative" @click.self="showList = false")
  h3(class="text-22 font-semibold uppercase") 
    | Amici ({{ friends.length }})
  div(class="search__wrapper relative mt-10")
    img(src="@/assets/svg/search.svg" alt="search-icon" width="30" height="30" class="absolute bottom-0 left-0")
    input(type="text" 
          placeholder="Cerca nuovi amici" 
          class="w-50 pl-8 bg-transparent border-b border-solid border-black focus:outline-none"
          @input="onDigit"
          @focus="onFocus")
    transition(name="slide-down" mode="out-in")
      div(v-if="showList" class="result__wrapper absolute top-[120%] left-0 min-w-[50%] h-auto bg-black/[.7] rounded-bl-[10px] rounded-br-[10px] overflow-hidden z-50")
        div(v-if="!searchResults.length" class="loader py-10 text-center")
          hollow-dots-spinner(:animation-duration="800" 
                              :dot-size="15" 
                              :dots-num="3" 
                              color="#BEBEBE"
                              class="inline-block")
        ul(v-else class="users__list px-3")
          li(v-for="(user, index) in searchResults" :key="index" class="flex flex-row justify-between items-center flex-nowrap my-3")
            avatar(:user="user" :label="user.username")
            button(class="btn btn-confirm ml-5" 
                  :class="checkUsers(user._id || '').status === 'friend' ? 'btn-cancellation' : 'btn-confirm'" 
                  :disabled="checkUsers(user._id || '').status === 'sent'"
                  @click="sendFriendRequest(user._id || '')")
              | {{ checkUsers(user._id || '').label }}
            button(v-if="checkUsers(user._id || '').status === 'received'" class="btn btn-cancellation ml-3")
              | Rimuovi
  section(class="friends__wrapper")
    div(v-if="!friends.length" class="no-friends__wrapper absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2")
      img(src="@/assets/svg/sad.svg" alt="sad-icon" width="200" height="200" class="inline-block transition-enter")
    div(v-else class="mt-10")
    h3
     | Lista di Amici
    ul(class="mt-3")
      li(v-for="(user, index) in friends" :key="index")
        avatar(:user="user" :label="user.username" classes="text-black")
</template>

<script setup lang="ts">
import { HollowDotsSpinner } from 'epic-spinners'
import type { User, Community } from '@/types/user'
import Avatar from '@/components/commons/Avatar.vue'
defineNuxtComponent({
  Avatar
})

const { data, refresh } = await useAsyncData<Community>('community', () => {
  const user_id = useCookie('user_id').value
  const token = useCookie('token').value
  return $fetch(`http://localhost:8080/api/user/${user_id}/community`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
})
const friends = computed(() => data.value.friends)
const requests_sent = computed(() => data.value.requests_sent)
const requests_received = computed(() => data.value.requests_received)
function checkUsers(id: string) {
  const friends_ids = friends.value.map(el => el._id)
  const sent_ids = requests_sent.value.map(el => el._id)
  const received_ids = requests_received.value.map(el => el._id)

  if(friends_ids.includes(id)) {
    return { status: 'friend', label: 'Rimuovi' }
  } else if(sent_ids.includes(id)) {
    return { status: 'sent', label: 'In attesa' }
  } else if(received_ids.includes(id)) {
    return { status: 'received', label: 'Accetta' }
  } else {
    return { status: 'new', label: 'Aggiungi' }
  }
}

const showList = ref<boolean>(false)
const searchResults = ref<User[]>([])

let bouncing: any = null
function onDigit($event: Event) {
  showList.value = true
  searchResults.value = []

  clearTimeout(bouncing)
  bouncing = setTimeout(() => {
    const value = ($event.target as HTMLInputElement).value
    fetchFriends(value)
  }, 500)
}

function onFocus($event: Event) {
  const value = ($event.target as HTMLInputElement).value
  if(value) {
    showList.value = true
    searchResults.value = []
    fetchFriends(value)
  }
}

async function fetchFriends(value: string) {
  if(!value) {
    showList.value = false
  } else {
    const token = useCookie('token').value
    const users = await $fetch<User[]>(`http://localhost:8080/api/users/${value}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    searchResults.value = users
  }
}

async function sendFriendRequest(friend_id: string) {
  if(friend_id) {
    const token = useCookie('token').value
    
    await $fetch(`http://localhost:8080/api/user/send-request/${friend_id}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token
      },
      async onResponse({ response }) {
        console.log(response._data)
        refresh()
      }
    })
  }
}
</script>