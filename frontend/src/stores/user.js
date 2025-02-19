import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createPersistedState } from './plugins/persist'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  function setUser(userData) {
    user.value = userData
  }

  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function clearUser() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const isAdmin = computed(() => {
    return user.value?.role === 'admin'
  })

  return {
    user,
    token,
    isAdmin,
    setUser,
    setToken,
    clearUser
  }
})
