import { createRouter, createWebHistory } from 'vue-router'
import { checkSystemStatus } from '@/api/system'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useSystemStore } from '@/stores/system'
import logger from '@/utils/logger'

const routes = [
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Index.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/user/Profile.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  try {
    const userStore = useUserStore()
    const systemStore = useSystemStore()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    if (requiresAuth && !userStore.token) {
      next('/login')
    } else if (to.path === '/login' && userStore.token) {
      next('/')
    } else {
      // 检查系统初始化状态
      if (to.path === '/system/initialize') {
        const { initialized } = await checkSystemStatus()
        systemStore.setInitialized(initialized)
        
        if (initialized) {
          ElMessage.warning('系统已初始化')
          return next('/')
        }
      }
      
      // 检查管理员权限
      if (to.meta.requiresAdmin && !userStore.isAdmin) {
        ElMessage.error('需要管理员权限')
        return next('/')
      }
      
      next()
    }
  } catch (error) {
    logger.error('Navigation error:', error)
    next('/login')
  }
})

export default router 