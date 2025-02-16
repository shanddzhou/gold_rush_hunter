import { createRouter, createWebHistory } from 'vue-router'
import { checkSystemStatus } from '@/api/system'
import store from '@/store'
import { ElMessage } from 'element-plus'
import logger from '@/utils/logger'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/BaseLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/dashboard/Index.vue')
      },
      {
        path: 'trade',
        children: [
          {
            path: 'strategy',
            component: () => import('../views/trade/strategy/Index.vue')
          },
          {
            path: 'positions',
            component: () => import('../views/trade/positions/Index.vue')
          },
          {
            path: 'orders',
            component: () => import('../views/trade/orders/Index.vue')
          }
        ]
      },
      {
        path: 'admin',
        meta: { requiresAdmin: true },
        children: [
          {
            path: 'users',
            component: () => import('../views/admin/users/Index.vue')
          },
          {
            path: 'permissions',
            component: () => import('../views/admin/permissions/Index.vue')
          },
          {
            path: 'invite-codes',
            component: () => import('../views/admin/invite-codes/Index.vue')
          },
          {
            path: 'monitor',
            component: () => import('../views/admin/system/Monitor.vue')
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: 'info',
            component: () => import('../views/profile/Info.vue')
          },
          {
            path: 'password',
            component: () => import('../views/profile/Password.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue')
  },
  {
    path: '/system/initialize',
    name: 'SystemInitialize',
    component: () => import('../views/system/Initialize.vue')
  },
  {
    path: '/admin/invite-codes',
    component: () => import('@/views/admin/invite-codes/Index.vue'),
    meta: {
      title: '邀请码管理',
      requiresAuth: true,
      permission: 'invite-code:manage'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 修改路由守卫
router.beforeEach(async (to, from, next) => {
  try {
    // 只在访问系统初始化页面时检查系统状态
    if (to.path === '/system/initialize') {
      const { initialized } = await checkSystemStatus()
      store.dispatch('setSystemStatus', { initialized })
      
      if (initialized) {
        ElMessage.warning('系统已初始化')
        return next('/')
      }
      return next()
    }
    
    // 权限检查
    const publicPages = ['/login', '/register']
    const authRequired = !publicPages.includes(to.path)
    
    const token = localStorage.getItem('token')
    
    if (authRequired && !token) {
      return next('/login')
    }
    
    // 检查管理员权限
    if (to.meta.requiresAdmin && !store.getters.isAdmin) {
      ElMessage.error('需要管理员权限')
      return next('/')
    }
    
    next()
  } catch (error) {
    logger.error('Navigation error:', error)
    next('/login')
  }
})

export default router 