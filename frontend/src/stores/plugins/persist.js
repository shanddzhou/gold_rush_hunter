import { watch } from 'vue'

export function createPersistedState(store, options = {}) {
  if (!store || !store.$id) {
    console.error('Invalid store provided to createPersistedState')
    return
  }

  const {
    key = store.$id,
    paths = null,
    storage = localStorage
  } = options

  try {
    // 从 storage 恢复状态
    const fromStorage = storage.getItem(key)
    if (fromStorage) {
      store.$patch(JSON.parse(fromStorage))
    }

    // 监听状态变化并保存
    watch(
      () => store.$state,
      (state) => {
        const toStore = paths 
          ? paths.reduce((obj, path) => {
              obj[path] = state[path]
              return obj
            }, {})
          : state
        storage.setItem(key, JSON.stringify(toStore))
      },
      { deep: true }
    )
  } catch (error) {
    console.error('Error in createPersistedState:', error)
  }
} 