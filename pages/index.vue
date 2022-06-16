<template lang="pug">
main.relative
  h1 BENTORNATO 
    span(class="underline italic") {{ user.username }}
  section(v-if="geolocation" class="mt-20")
    h2 {{ geolocation.city }} - {{ new Date().toLocaleDateString() }}
    section(class="flex flex-row justify-between items-center flex-nowrap mt-10")
      div(class="weather__wrapper flex flex-row justify-start items-center flex-nowrap")
        p(class="text-22 font-semibold italic mr-10") {{ geolocation.meteo_description }}
        img(:src="geolocation.meteo_icon" alt="meteo-icon" width="100" height="100" class="max-w-[100px] max-h-[100px]")
      div(class="temp__wrapper flex flex-row justify-start items-center flex-nowrap")
        img(src="@/assets/svg/thermometer.svg" alt="thermometer-icon" width="100" height="100" class="max-w-[100px] max-h-[100px] mr-10")
        p(class="text-40 font-semibold") {{ geolocation.temperature }} °C
    span(class="clock fixed bottom-[20px] right-[20px] text-22 italic") {{ clock }}
  loader(v-else class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2")
</template>

<script setup lang="ts">
import Loader from '@/components/commons/Loader.vue'
import type { User } from '@/types/user'
defineNuxtComponent({
  Loader
})

const { data, refresh } = await useAsyncData<User>('index', (): any => {
  const user_id = useCookie('user_id')

  if(user_id.value) {
    return $fetch('http://localhost:8080/api/user/' + user_id.value)
  }
})
const user = computed(() => data.value)
const clock = ref<string>(new Date().toLocaleTimeString())

const geolocation = ref<any>(null)
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
}
async function getCurrentGeolocationWeather(pos: any) {
  const { latitude, longitude } = pos.coords;
  const data: any = await $fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=3c6416d0cf645797ec1ecd6ee38990af`)
  
  const city = data.name
  const meteo_description = data.weather[0].description
  const meteo_icon = '../assets/svg/' + data.weather[0].main + '.svg'
  const temperature = data.main.temp
  geolocation.value = { city, meteo_description, meteo_icon, temperature }
}
function errorGeolocation(err: any) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
onBeforeMount(() => {
  navigator.geolocation.getCurrentPosition(getCurrentGeolocationWeather, errorGeolocation, options)
  setInterval(() => {
    clock.value = new Date().toLocaleTimeString()
  }, 1000)
})
</script>