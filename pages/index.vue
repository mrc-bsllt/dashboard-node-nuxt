<template lang="pug">
main 
  h1 BENTORNATO 
    span(class="underline italic") {{ user.username }}
  section(v-if="geolocation")
    p {{ geolocation }}
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
  const data: any = await $fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=3c6416d0cf645797ec1ecd6ee38990af`)

  const city = data.name
  const meteo_description = data.weather[0].description
  const meteo_icon = 'https://openweathermap.org/img/w/' + data.weather[0].icon + 'png'
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