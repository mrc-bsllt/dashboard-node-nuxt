<template lang="pug">
aside(v-bind="$attrs" class="min-w-[50px] h-full bg-black px-3 py-5")
  ul(class="items-list flex flex-col justify-start items-center flex-nowrap")
    li(v-for="(item, index) in items" :key="index")
      nuxt-link(:to="item.path")
        img(:src="'../assets/svg/' + item.icon + '.svg'" :alt="'icon-' + item.icon" width="50" height="50")
</template>

<script setup lang="ts">
import type { Item } from '@/types/aside'

const items = ref<Item[]>([
  { label: 'Todos', icon: 'todo', path: '/' }
])
</script>