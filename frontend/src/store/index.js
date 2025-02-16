import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    isAuthenticated: false
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
      
      // 将用户信息保存到 localStorage
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user)
    },
    clearUser({ commit }) {
      commit('SET_USER', null)
      // 清除 token
      localStorage.removeItem('token')
    },
    // 从 localStorage 恢复用户信息
    restoreUser({ commit }) {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          commit('SET_USER', user)
        } catch (error) {
          console.error('Failed to parse user data:', error)
          localStorage.removeItem('user')
        }
      }
    }
  },
  getters: {
    isAdmin: state => state.user?.role === 'admin',
    isAuthenticated: state => !!state.user,
    userPermissions: state => state.user?.permissions || []
  },
  modules: {}
}) 