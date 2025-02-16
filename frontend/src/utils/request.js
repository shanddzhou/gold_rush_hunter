import axios from 'axios'
import logger from './logger'
import errorHandler from './error-handler'
import { ElMessage } from 'element-plus'
import store from '@/store'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  withCredentials: true,  // 允许携带认证信息
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 记录请求信息
    logger.info('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data
    })
    
    // 添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // 确保 OPTIONS 请求也带上正确的 headers
    if (config.method === 'options') {
      config.headers['Access-Control-Request-Method'] = 'POST'
      config.headers['Access-Control-Request-Headers'] = 'content-type'
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
    if (error.response?.status === 401) {
      // token 失效，清除用户信息和 token
      store.dispatch('clearUser')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default service 