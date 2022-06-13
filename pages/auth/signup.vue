<template lang="pug">
section(class="flex flex-row justify-center items-center flex-nowrap")
  div(class="form__container w-60 p-10 bg-white rounded-[15px] shadow-lg")
    form(@submit.prevent="submittingSignup" method="POST" novalidate)
      div(v-for="(input, index) in formInputs" :key="index" class="input__container relative mb-10")
        label(:for="'signup__' + input.field" class="input__label mb-2 text-16 font-semibold")
          | {{ input.label }}
        input(:type="input.type" 
              :id="'signup__' + input.field"
              class="w-full bg-transparent border-b border-solid border-gold focus:outline-none"
              v-model="newUser[input.field]"
              autocomplete="on")
        small(v-if="input.error" class="error-message absolute top-[110%] left-0 text-10 text-error")
          | {{ input.error_message }}
      div.submit__wrapper.text-center
        button(type="submit" class="underline") Signup
</template>

<script setup lang="ts">
import type { User, FormInput, ErrorInput } from '@/types/user'

const formInputs = ref<FormInput[]>([
  { 
    label: 'Username', 
    type: 'text', 
    field: 'username', 
    error: false,
    error_message: ''
  },
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
  },
  { 
    label: 'Confirm Password', 
    type: 'password', 
    field: 'confirm_password',
    error: false,
    error_message: ''
  },
])

const newUser = ref<User>({
  username: '',
  email: '',
  password: '',
  confirm_password: ''
})

async function submittingSignup() {
  formInputs.value.forEach(input => {
    input.error = false
    input.msg = ''
  })
  
  const username = newUser.value.username
  const email = newUser.value.email
  const password = newUser.value.password
  const confirm_password = newUser.value.confirm_password

  await $fetch('http://localhost:8080/api/auth/signup', {
    method: 'POST',
    body: { username, email, password, confirm_password },
    async onResponse({ request, response, options }) {
      console.log(response._data.errors)
      const errors: ErrorInput[] | undefined = response._data.errors
      if(errors) {
        errors.forEach(error => {
          const field = error.param
          const index = formInputs.value.findIndex(input => input.field === field)
          formInputs.value[index].error = true
          formInputs.value[index].error_message = error.msg
        })
      }
    }
  })
}
</script>