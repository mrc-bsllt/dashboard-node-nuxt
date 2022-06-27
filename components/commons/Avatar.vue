<template lang="pug">
section(class="left flex flex-row justify-start items-center flex-nowrap")
  div(class="image__wrapper relative w-[50px] h-[50px] mr-3 rounded-[50%] bg-grey overflow-hidden" 
      :class="{ 'flex flex-row justify-center items-center flex-nowrap': !user.image_path }")
    img(:src="user.image_path || '../../assets/svg/user.svg'" :class="{ 'cover_image': user.image_path }")
  span(v-if="label" class="text-18" :class="classes")
    | {{ label }}
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
defineProps({
  user: { 
    type: Object as () => User, 
    required: true 
  },
  label: { type: String },
  classes: { type: String, default: 'text-grey' }
})
</script>