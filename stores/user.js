import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {

  const user = ref({
    id: '',
    email: '', 
    isEmailVerified: false,
    rate: 0, 
    role: 'USER', 
    username: '', 
    token: ''
  })
  
  function setUser(payload) {
    console.log('payload',payload)
    user.value = payload ? payload : {
      id: '',
      email: '', 
      isEmailVerified: false,
      rate: 0, 
      role: 'USER', 
      username: '', 
      token: ''
    }
  }

  return {
    user,
    setUser,
  }
})
