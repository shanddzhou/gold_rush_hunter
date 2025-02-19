import { useUserStore } from './user'
import { useSystemStore } from './system'
import { createPersistedState } from './plugins/persist'

// 初始化所有 store
export function setupStores(pinia) {
  const userStore = useUserStore(pinia)
  const systemStore = useSystemStore(pinia)

  // 添加持久化
  userStore.$subscribe((mutation, state) => {
    createPersistedState(userStore, {
      paths: ['user', 'token']
    })
  })

  return {
    userStore,
    systemStore
  }
}

export {
  useUserStore,
  useSystemStore
}