import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemStore = defineStore('system', () => {
  const initialized = ref(false)

  function setInitialized(status) {
    initialized.value = status
  }

  return {
    initialized,
    setInitialized
  }
}) 