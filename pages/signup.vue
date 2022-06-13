<template lang="pug">
main
  form(@submit.prevent="submittingSignup" method="POST" novalidate)
    div.input__container
      label.input__label Username
      input(type="text")
</template>

<script setup lang="ts">
import type { User } from '@/types/user'

const newUser = ref<User>({
  username: '',
  email: '',
  password: '',
  confirm_password: '',
  created_at: null,
  updated_at: null
})

function submittingSignup() {
  console.log('FIRED')
}
</script>