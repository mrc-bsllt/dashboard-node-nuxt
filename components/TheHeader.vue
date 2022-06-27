<template lang="pug">
section(class="section-header relative")
  header#header(class="relative py-4 px-6 bg-black text-grey border-b border-solid border-gold z-50")
    nuxt-link(to="/" class="absolute top-1/2 left-[24px] -translate-y-1/2")
      icon(name="home")
    ul(class="header__list w-full h-full flex flex-row justify-end items-center flex-nowrap") 
      template(v-if="!get_show_logout")
        li.px-2
          nuxt-link(to="/auth/login" class="text-grey")
            | Login 
        li.pl-2
          nuxt-link(to="/auth/signup" class="text-grey")
            | Signup 
      template(v-else)
        li.notification.relative.px-2
          button(@click="toggleNotification")
            img(src="@/assets/svg/notification.svg" alt="notification-icon" width="30" height="30")
          div(v-if="get_user.requests_received?.length" class="notification__counter absolute -top-[10px] right-0 w-[20px] h-[20px] text-white text-8 text-center leading-[20px] font-semibold bg-error rounded-[50%] animate-bounce")
            | {{ get_user.requests_received.length }}
        li.px-2.flex.flex-row.justify-center.items-center.flex-nowrap
          label(for="image-upload" class="flex flex-row justify-center items-center flex-nowrap relative w-[60px] h-[60px] rounded-[50%] bg-grey cursor-pointer overflow-hidden")
            img(v-if="!updated_url" 
                :src="get_user.image_path" 
                alt="user-svg" 
                width="50" 
                height="50" 
                :class="{ 'cover_image': !get_user.image_path?.includes('.svg') }")
            img(v-else :src="updated_url" alt="updated-image" width="40" height="40" class="cover_image")
          input(type="file" id="image-upload" class="hidden" @change="fileSelected")
        li.pl-2
          button(@click="logout" class="text-grey")
            | logout 
  transition(name="slide-down" mode="out-in")
    div(v-if="show_banner" 
        class="box absolute top-full right-0 flex flex-row items-center flex-nowrap min-w-[400px] py-10 rounded-bl-[10px] z-40 overflow-hidden" 
        :class="[error_banner ? 'bg-error' : 'bg-black', is_notification ? 'justify-start px-10' : 'justify-center px-20']")
      //- lista delle notifiche
      ul(v-if="is_notification && get_user.requests_received?.length")
        li(v-for="(user, index) in get_user.requests_received" 
          :key="index" 
          :class="{ 'border-b border-solid border-grey pb-5 mb-5': index < get_user.requests_received.length - 1 }")
          avatar(:user="user" :label="user.username + ' ti ha inviato una richiesta di amicizia'")
          div(class="buttons__wrapper mt-3")
            button(class="btn btn-confirm mr-3")
              | Accetta
            button(class="btn btn-cancellation" @click="rejectFriendship(user._id || '', toggle_refresh_data)")
              | Rifiuta
      //- Messaggio errore nel caricamento dell'immagine
      p(v-else-if="error_banner" class="text-white text-16 font-semibold uppercase") Image must be png, jpg, jpeg or webp!
      //- Caricare l'immagine nuova
      template(v-else)
        button(class="btn btn-confirm mx-3" @click="updateImage") Save
        button(class="btn btn-cancellation mx-3" @click="clearInput") Cancel
</template>

<script setup lang="ts">
import openSocket from 'socket.io-client'
import { useHeader } from '@/store/header'
import Icon from '@/components/commons/Icon.vue'
import Avatar from '@/components/commons/Avatar.vue'
import { useUser } from '@/store/user'
import { rejectFriendship } from '@/composables/friendship'
defineNuxtComponent({
  Icon,
  Avatar
})

const { get_user } = toRefs(useUser())
const { reset_user, toggle_refresh_data, add_request } = useUser()

const { get_show_logout } = toRefs(useHeader())
const { set_show_logout } = useHeader()

const show_banner = ref<boolean>(false)
const error_banner = ref<boolean>(false)
const is_notification = ref<boolean>(false)
const types_accepted = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
const updated_url = ref<string | null>(null)

function fileSelected($event: Event): void {
  const files = ($event.target as HTMLInputElement).files
  if(files?.length) {
    const file = files[0]

    if(!types_accepted.includes(file.type)) {
      error_banner.value = true
      show_banner.value = true
      const input_file = document.getElementById('image-upload')! as HTMLInputElement
      input_file.value = ''

      setTimeout(() => {
        show_banner.value = false
      }, 3000)
    } else {
      if(error_banner.value) {
        error_banner.value = false
      }

      updated_url.value = URL.createObjectURL(file)
      show_banner.value = true
    }
  }
}

function clearInput(): void {
  updated_url.value = null
  const input_file = document.getElementById('image-upload')! as HTMLInputElement
  input_file.value = ''
  show_banner.value = false
}

async function updateImage() {
  const token = useCookie('token')
  const user_id = useCookie('user_id')
  if(!token.value || !user_id.value) {
    return navigateTo('/auth/login')
  }

  const input_file = document.getElementById('image-upload')! as HTMLInputElement

  if(input_file?.files?.length) {
    const file = input_file.files[0]
    const formData = new FormData()
    formData.append('image_path', file)

    await $fetch('http://localhost:8080/api/user/update-image/' + user_id.value, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: 'Bearer ' + token.value
      },
      async onResponse({ request, response, options }) {
        toggle_refresh_data()
        clearInput()
      }
    })
  }
}

function logout() {
  useCookie('token').value = ''
  useCookie('user_id').value = ''
  set_show_logout(false)
  reset_user()
  window.location.href = '/auth/login'
}

function toggleNotification() {
  if(get_user.value.requests_received?.length) {
    show_banner.value = !show_banner.value
    is_notification.value = !is_notification.value
  }
}
watch(() => get_user.value.requests_received?.length, () => {
  show_banner.value = true
  is_notification.value = true
  setTimeout(() => {
    show_banner.value = false
    is_notification.value = false
  }, 3000)
})
onMounted(() => {
  const socket = openSocket('http://localhost:8080')
    socket.on('requests', data => {
    if(data.action === 'send') {
      const { friend_id, user } = data
      const user_id = useCookie('user_id').value
      if(friend_id === user_id) {
        add_request(user)
      }
    }
  })
})
</script>