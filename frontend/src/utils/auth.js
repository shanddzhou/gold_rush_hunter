import store from '@/store'
import router from '@/router'
import { ElMessage } from 'element-plus'

const TIMEOUT = 5 * 60 * 1000 // 5分钟超时
let timer = null
let lastActivityTime = Date.now()

// 更新最后活动时间
export function updateLastActivityTime() {
  lastActivityTime = Date.now()
}

// 检查会话是否过期
export function checkSessionTimeout() {
  const currentTime = Date.now()
  if (currentTime - lastActivityTime > TIMEOUT) {
    handleTimeout()
  }
}

// 处理超时登出
export function handleTimeout() {
  // 清除登录状态
  store.dispatch('clearUser')
  localStorage.removeItem('token')
  
  // 清除定时器
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  
  // 显示提示信息
  ElMessage.warning('登录已过期，请重新登录')
  
  // 跳转到登录页
  router.push('/login')
}

// 启动会话监控
export function startSessionMonitor() {
  // 初始化最后活动时间
  updateLastActivityTime()
  
  // 添加用户活动监听器
  document.addEventListener('mousemove', updateLastActivityTime)
  document.addEventListener('keydown', updateLastActivityTime)
  document.addEventListener('click', updateLastActivityTime)
  
  // 启动定时检查
  timer = setInterval(checkSessionTimeout, 1000 * 30) // 每30秒检查一次
}

// 停止会话监控
export function stopSessionMonitor() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  
  document.removeEventListener('mousemove', updateLastActivityTime)
  document.removeEventListener('keydown', updateLastActivityTime)
  document.removeEventListener('click', updateLastActivityTime)
} 