import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/stores/user'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  withCredentials: true,  // 允许跨域携带 cookie
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => response.data,
  error => {
    console.error('Response error:', error)
    
    if (error.response?.status === 401) {
      const userStore = useUserStore()
      userStore.clearUser()
      router.push('/login')
    }
    
    ElMessage.error(error.response?.data?.message || '请求失败')
    return Promise.reject(error)
  }
)

export default service 