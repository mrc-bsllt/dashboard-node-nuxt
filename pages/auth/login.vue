<template lang="pug">
section(class="flex flex-row justify-center items-center flex-nowrap")
  div(class="form__container w-60 p-10 bg-white rounded-[15px] shadow-lg")
    form(@submit.prevent="submittingLogin" method="POST" novalidate)
      div(v-for="(input, index) in formInputs" :key="index" class="input__container mb-10")
        label(class="input__label mb-2 text-16 font-semibold")
          | {{ input.label }}
        input(:type="input.type" class="w-full bg-transparent border-b border-solid border-gold focus:outline-none")
      div.submit__wrapper.text-center
        button(type="submit" class="underline") Login
</template>

<script setup lang="ts">
import type { User, FormInput } from '@/types/user'

const formInputs: FormInput[] = [
  { label: 'Email', type: 'email' },
  { label: 'Password', type: 'password' }
]

const user = ref<User>({
  email: '',
  password: ''
})

function submittingLogin() {
  console.log('FIRED')
}
</script>