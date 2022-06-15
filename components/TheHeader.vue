<template lang="pug">
section(class="section-header relative")
  header#header(class="relative py-4 px-6 bg-black text-grey border-b border-solid border-gold z-50")
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
      template(v-else)
        li.px-2.flex.flex-row.justify-center.items-center.flex-nowrap 
          label(for="image-upload" class="flex flex-row justify-center items-center flex-nowrap relative w-[40px] h-[40px] rounded-[50%] bg-grey cursor-pointer overflow-hidden")
            img(v-if="!updated_url" :src="user_image" alt="user-svg" width="30" height="30" :class="{ 'cover_image': !user_image.includes('.svg') }")
            img(v-else :src="updated_url" alt="updated-image" width="40" height="40" class="cover_image")
          input(type="file" id="image-upload" class="hidden" @change="fileSelected")
        li.pl-2
          button(@click="logout")
            | logout 
  transition(name="slide-down" mode="out-in")
    div(v-if="show_banner" 
        class="box absolute top-full right-0 flex flex-row justify-center items-center flex-nowrap min-w-[400px] px-20 py-10 rounded-bl-[10px] z-40" 
        :class="error_banner ? 'bg-error' : 'bg-black'")
      p(v-if="error_banner" class="text-white text-16 font-semibold uppercase") Image must be png, jpg, jpeg or webp!
      template(v-else)
        button(class="btn btn-confirm mx-3" @click="updateImage") Save
        button(class="btn btn-cancellation mx-3" @click="clearInput") Cancel
</template>

<script setup lang="ts">
import { useHeader } from '@/store/header'
import Icon from '@/components/commons/Icon.vue'
import type { User } from '@/types/user'
defineNuxtComponent({
  Icon
})

const { data, refresh } = await useAsyncData<User>('user', (): any => {
  const user_id = useCookie('user_id')
  if(user_id.value) {
    return $fetch('http://localhost:8080/api/user/' + user_id.value)
  } else {
    return null
  }
})

const user_image = computed(() => {
  return data?.value?.image_path ? 'http://localhost:8080' + data.value.image_path : '../assets/svg/user.svg'
})

const headerStore = useHeader()
const { get_show_logout } = toRefs(headerStore)

const show_banner = ref<boolean>(false)
const error_banner = ref<boolean>(false)
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
        clearInput()
      }
    })
  }
}

function logout() {
  useCookie('token').value = undefined
  useCookie('user_id').value = undefined
  navigateTo('/auth/login')
}
</script>

<style scoped lang="scss">
.cover_image {
  @apply absolute top-0 left-0 w-full h-full object-center object-cover;
}
</style>