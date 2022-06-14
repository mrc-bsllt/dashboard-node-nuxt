import { useHeader } from '@/store/header'

export default defineNuxtRouteMiddleware((to, from) => {
  if(to.matched.length) {
    const token = useCookie('token').value
    const user_id = useCookie('user_id').value
    const to_path = to.fullPath
  
    const headerStore = useHeader()
    const { set_show_logout } = headerStore
    set_show_logout(token !== undefined || user_id !== undefined)
  
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