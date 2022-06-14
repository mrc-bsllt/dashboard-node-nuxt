<template lang="pug">
main#error-page(class="w-full h-screen flex flex-col justify-center items-center flex-nowrap bg-black overflow-hidden")
  h1(class="uppercase text-60 text-grey font-semibold") {{ props.error?.statusCode }} error
  button(@click="handleError" class="text-grey underline") Come back!
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

