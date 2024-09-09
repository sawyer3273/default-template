import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMainStore = defineStore('main', () => {

  const user = ref({
    email: '', 
    isEmailVerified: false,
    rate: 0, 
    role: 'USER', 
    username: '', 
    token: ''
  })
  const loader = ref(false)

  const actors = ref([])
  const actors_count = ref(0)
  
  const isFieldFocusRegistered = ref(false)

  const clients = ref([
    
  ])
  const history = ref([
    {
      amount: 375.53,
      name: 'Home Loan Account',
      date: '3 days ago',
      type: 'deposit',
      business: 'Turcotte',
      account: "1"
    },
  
  ])

  function setUser(payload) {
    user.value = payload ? payload : {
      email: '', 
      isEmailVerified: false,
      rate: 0, 
      role: 'USER', 
      username: '', 
      token: ''
    }
  }

  function setLoader(payload) {
    loader.value = payload
  }

  function setActors(payload) {
    if (payload.data) {
      actors.value = payload.data
    }
    if (payload.total) {
      actors_count.value = payload.total
    }
  }




  return {
    user,
    actors,
    actors_count,
    isFieldFocusRegistered,
    clients,
    history,
    loader,
    setUser,
    setLoader,
    setActors
  }
})
