<template lang="pug">
main 
  h1 BENTORNATO 
    span(class="underline italic") {{ user.username }}
  section(v-if="geolocation" class="mt-20")
    h2 {{ geolocation.city }} - {{ new Date().toLocaleDateString() }}
    div(class="weather__wrapper flex flex-row justify-start items-center flex-nowrap")
      p(class="text-22 font-semibold italic mr-10") {{ geolocation.meteo_description }}
      img(:src="geolocation.meteo_icon" alt="meteo-icon" width="100" height="100" class="max-w-[100px] max-h-[100px]")
    div(class="temp__wrapper flex flex-row justify-start items-center flex-nowrap mt-10")
      img(src="@/assets/svg/thermometer.svg" alt="thermometer-icon" width="200" height="200" class="max-w-[200px] max-h-[400px] mr-10")
      p(class="text-40 font-semibold") {{ geolocation.temperature }} °C
  p(v-else) ...Loading
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
const { data, refresh } = await useAsyncData<User>('index', (): any => {
  const user_id = useCookie('user_id')

  if(user_id.value) {
    return $fetch('http://localhost:8080/api/user/' + user_id.value)
  }
})
const user = computed(() => data.value)
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
})
</script>