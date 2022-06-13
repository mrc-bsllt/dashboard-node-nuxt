<template lang="pug">
section(class="flex flex-row justify-center items-center flex-nowrap")
  div(class="form__container w-60 p-10 bg-white rounded-[15px] shadow-lg")
    form(@submit.prevent="submittingLogin" method="POST" novalidate)
      div(v-for="(input, index) in formInputs" :key="index" class="input__container mb-10")
        label(:for="'login__' + input.field" class="input__label mb-2 text-16 font-semibold")
          | {{ input.label }}
        input(:type="input.type" 
              :id="'login__' + input.field"
              class="w-full bg-transparent border-b border-solid border-gold focus:outline-none"
              v-model="user[input.field]"
              autocomplete="on")
      div.submit__wrapper.text-center
        button(type="submit" class="underline") Login
</template>

<script setup lang="ts">
import type { User, FormInput } from '@/types/user'

const formInputs: FormInput[] = [
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
]

const user = ref<User>({
  email: '',
  password: ''
})

function submittingLogin() {
  console.log('FIRED')
}
</script>