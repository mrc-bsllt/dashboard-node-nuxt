<template lang="pug">
main.relative
  h1 BENTORNATO 
    span(class="underline italic") 
      | {{ get_user.username }}
  section(v-if="geolocation" class="transition-enter mt-20")
    h2 {{ geolocation.city }} - {{ new Date().toLocaleDateString() }}
    section(class="flex flex-row justify-start items-center flex-nowrap mt-10")
      div(class="weather__wrapper flex flex-row justify-start items-center flex-nowrap mr-20")
        p(class="text-22 font-semibold italic mr-10") {{ geolocation.meteo_description }}
        img(:src="geolocation.meteo_icon" alt="meteo-icon" width="100" height="100" class="max-w-[100px] max-h-[100px]")
      div(class="temp__wrapper flex flex-row justify-start items-center flex-nowrap")
        img(src="@/assets/svg/thermometer.svg" alt="thermometer-icon" width="100" height="100" class="max-w-[100px] max-h-[100px] mr-10")
        p(class="text-40 font-semibold") {{ geolocation.temperature }} °C
  section(v-else-if="error_geolocation" class="h-[90%] flex flex-col justify-center items-center flex-nowrap transition-enter")
    img(src="@/assets/svg/sad.svg" alt="sad-icon" width="200" height="200")
    div(class="text-22")
      span Sorry! We could not geolocate you, please 
      button(class="font-semibold uppercase" @click="getGeolocation") try again!
  hollow-dots-spinner(v-else 
                      :animation-duration="800" 
                      :dot-size="30" 
                      :dots-num="3" 
                      color="#303030" 
                      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2")
</template>

<script setup lang="ts">
import { HollowDotsSpinner } from 'epic-spinners'
import { useUser } from '@/store/user'

const { get_user } = toRefs(useUser())

const geolocation = ref<any>(null)
const error_geolocation = ref<boolean>(false)
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
  error_geolocation.value = true
}
function getGeolocation() {
  geolocation.value = null
  error_geolocation.value = false
  navigator.geolocation.getCurrentPosition(getCurrentGeolocationWeather, errorGeolocation, options)
}
onBeforeMount(() => {
  if(!geolocation.value) {
    getGeolocation()
  }
})
</script>