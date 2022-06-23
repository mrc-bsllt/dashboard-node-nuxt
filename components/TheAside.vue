<template lang="pug">
aside(v-bind="$attrs" class="min-w-[50px] h-full bg-black px-3 py-5")
  ul(class="items-list flex flex-col justify-start items-center flex-nowrap")
    li(v-for="(item, index) in items" :key="index" :class="{ 'mb-5': index < items.length - 1 }")
      nuxt-link(:to="username ? `/${username}${item.path}` : '/'")
        img(:src="'../assets/svg/' + item.icon + '.svg'" :alt="'icon-' + item.icon" width="50" height="50")
</template>

<script setup lang="ts">
import type { Item } from '@/types/aside'
import { useUser } from '@/store/user'
const { get_user } = toRefs(useUser())
const username = computed(() => get_user.value.username)

const items = ref<Item[]>([
  { label: 'Todos', icon: 'todo', path: '/todos' },
  { label: 'Friends', icon: 'friends', path: '/friends' }
])
</script>