<template lang="pug">
main(id="todos")
  input(type="text")
  button(@click="submitForm") Add
</template>

<script setup lang="ts">
async function submitForm() {
  const token = useCookie('token')
  await $fetch('http://localhost:8080/api/todo', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token.value
    },
    body: { content: 'Prima todo' },
    async onResponse({ response }) {
      console.log(response)
    }
  })
}
</script>