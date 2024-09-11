import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useComponentStore = defineStore('component', () => {
  const autofillData = ref([])
  const autofillLoading = ref(false)

  function setAutofillData(payload = []) {
    autofillData.value = payload 
  }
  function setAutofillLoading(payload = false) {
    autofillLoading.value = payload 
  }

  return {
    autofillData,
    autofillLoading,
    setAutofillData,
    setAutofillLoading
  }
})
