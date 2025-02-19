import { useUserStore } from '@/stores/user'
import router from '@/router'
import { ElMessage } from 'element-plus'

// 会话监控
export function startSessionMonitor() {
  const userStore = useUserStore()
  
  // 检查 token 是否存在
  if (!userStore.token) {
    return
  }
  
  // 定期检查会话状态
  const checkSession = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      userStore.clearUser()
      router.push('/login')
    }
  }
  
  // 每分钟检查一次
  setInterval(checkSession, 60000)
  
  // 监听存储事件
  window.addEventListener('storage', (e) => {
    if (e.key === 'token' && !e.newValue) {
      userStore.clearUser()
      router.push('/login')
    }
  })
}