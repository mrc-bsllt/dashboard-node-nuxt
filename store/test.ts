import { defineStore } from "pinia"

interface Test {
  message: String
}

export const useTest = defineStore('test', {
  state: (): Test => ({
    message: ''
  }),
  actions: {
    setMessage(value: number): void {
      this.message = 'Test Pinia' + value
    }
  },
  getters: {
    getMessage(): String {
      return this.message
    }
  }
})