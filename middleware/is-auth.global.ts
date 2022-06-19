export default defineNuxtRouteMiddleware((to, from) => {
  if(to.matched.length) {
    const token = useCookie('token').value
    const user_id = useCookie('user_id').value
    const to_path = to.fullPath
    
    if(to_path === '/auth/login' || to_path === '/auth/signup') {
      if(token || user_id) {
        return navigateTo('/')
      }
    } else {
      if(!token || !user_id) {
        return navigateTo('/auth/login')
      }
    }
  }
})