import { defineStore } from "pinia"

interface HeaderState {
  show_logout: boolean
}

export const useHeader = defineStore('header', {
  state: (): HeaderState => ({
    show_logout: false
  }),
  actions: {
    set_show_logout(value: boolean): void {
      this.show_logout = value
    }
  },
  getters: {
    get_show_logout(): boolean {
      return this.show_logout
    }
  }
})