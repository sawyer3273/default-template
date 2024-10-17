import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {

  const user = ref({
    id: '',
    email: '', 
    avatar: '', 
    isEmailVerified: false,
    rate: 0, 
    role: 'USER', 
    username: '', 
    token: ''
  })
  
  function setUser(payload) {
    user.value = payload ? payload : {
      id: '',
      email: '', 
      isEmailVerified: false,
      rate: 0, 
      avatar: '', 
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
