export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token')
  const user_id = useCookie('user_id')

  if(!token.value || !user_id.value) {
    return navigateTo('/auth/login')
  }
})