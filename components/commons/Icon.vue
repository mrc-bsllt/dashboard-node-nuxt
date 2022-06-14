<template lang="pug">
svg.ico(:class="`icon-${name}`" v-bind="$attrs")
  use(:xlink:href="`/ico-defs.svg?v=20210108#icon-${name}`")
</template>

<script setup lang="ts">
defineProps({
  name: { type: String, required: true }
})
</script>