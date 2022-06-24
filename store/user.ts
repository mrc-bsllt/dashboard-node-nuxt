import { defineStore } from "pinia"
import { User } from '@/types/user'
interface UserState {
  user: User
  refresh_data: boolean
}

export const useUser = defineStore('user', {
  state: (): UserState => ({
    user: {
      username: '',
      image_path: '../assets/svg/user.svg',
      requests_received: []
    },
    refresh_data: false
  }),
  actions: {
    set_user(user: User): void {
      this.user.username = user.username
      if(user.image_path) {
        this.user.image_path = 'http://localhost:8080' + user.image_path
      }
      this.user.requests_received = user.requests_received
    },
    add_request(user: User): void {
      this.user.requests_received?.push(user)
    },
    reset_user(): void {
      this.user.username = ''
      this.user.image_path = '../assets/svg/user.svg'
      this.user.requests_received = []
    },
    toggle_refresh_data(): void {
      this.refresh_data = true
      setTimeout(() => {
        this.refresh_data = false
      }, 100)
    }
  },
  getters: {
    get_user(): User {
      return this.user
    },
    get_refresh_data(): boolean {
      return this.refresh_data
    }
  }
})