<template lang="pug">
section(class="flex flex-row justify-center items-center flex-nowrap")
  div(class="form__container w-60 p-10 bg-white rounded-[15px] shadow-lg")
    form(@submit.prevent="submittingLogin" method="POST" novalidate)
      div(v-for="(input, index) in formInputs" :key="index" class="input__container relative mb-10")
        label(:for="'login__' + input.field" class="input__label mb-2 text-16 font-semibold" :class="{ 'text-error': input.error }")
          | {{ input.label }}
        input(:type="input.type" 
              :id="'login__' + input.field"
              class="w-full border-b border-solid focus:outline-none"
              :class="!input.error ? 'bg-transparent border-gold' : 'border-error'"
              v-model="user[input.field]"
              autocomplete="on"
              @input="resetError(index)")
        small(v-if="input.error" class="error-message absolute top-[110%] left-0 text-10 text-error")
          | {{ input.error_message }}
      div.submit__wrapper.text-center
        button(type="submit" class="underline") Login
</template>

<script setup lang="ts">
import type { User, FormInput, ErrorInput } from '@/types/user'

const formInputs = ref<FormInput[]>([
  { 
    label: 'Email', 
    type: 'email', 
    field: 'email', 
    error: false,
    error_message: ''
  },
  { 
    label: 'Password', 
    type: 'password', 
    field: 'password',
    error: false,
    error_message: ''
  }
])

const user = ref<User>({
  email: '',
  password: ''
})

function resetError(index: number): void {
  if(formInputs.value[index].error) {
    formInputs.value[index].error = false
    formInputs.value[index].error_message = ''
  }
}

async function submittingLogin() {
  formInputs.value.forEach(input => {
    input.error = false
    input.error_message = ''
  })

  const email = user.value.email
  const password = user.value.password

  await $fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    body: { email, password },
    async onResponse({ request, response, options }) {
      const errors: ErrorInput[] | undefined = response._data.errors
      if(errors) {
        errors.forEach(error => {
          const field = error.param
          const index = formInputs.value.findIndex(input => input.field === field)
          formInputs.value[index].error = true
          formInputs.value[index].error_message = error.msg
        })
      } else {
        const { token, user_id } = response._data
        useCookie('token').value = token
        useCookie('user_id').value = user_id
        const router = useRouter()
        router.push({ path: '/' })
      }
    }
  })
}
</script>