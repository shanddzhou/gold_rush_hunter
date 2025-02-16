<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '240px'" class="aside">
      <div class="logo-container" @click="goHome">
        <img src="@/assets/logo.png" alt="GoldRush" class="logo" />
        <h1 v-show="!isCollapse">GoldRush Hunter</h1>
      </div>
      
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          class="menu"
          :router="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          unique-opened
        >
          <!-- 仪表盘 - 所有用户可见 -->
          <el-menu-item index="/">
            <el-icon><Monitor /></el-icon>
            <template #title>仪表盘</template>
          </el-menu-item>
          
          <!-- 交易管理 - 普通用户和交易员可见 -->
          <template v-if="hasPermission('trade:view')">
            <el-sub-menu index="trade">
              <template #title>
                <el-icon><TrendCharts /></el-icon>
                <span>交易管理</span>
              </template>
              
              <!-- 策略管理 - 需要特定权限 -->
              <el-menu-item 
                v-if="hasPermission('strategy:manage')" 
                index="/trade/strategy"
              >
                <el-icon><SetUp /></el-icon>
                <span>策略管理</span>
              </el-menu-item>
              
              <!-- 持仓管理 - 需要特定权限 -->
              <el-menu-item 
                v-if="hasPermission('position:view')" 
                index="/trade/positions"
              >
                <el-icon><Wallet /></el-icon>
                <span>持仓管理</span>
              </el-menu-item>
              
              <!-- 订单管理 - 需要特定权限 -->
              <el-menu-item 
                v-if="hasPermission('order:view')" 
                index="/trade/orders"
              >
                <el-icon><List /></el-icon>
                <span>订单管理</span>
              </el-menu-item>
            </el-sub-menu>
          </template>
          
          <!-- 系统管理 - 仅管理员可见 -->
          <template v-if="isAdmin">
            <el-sub-menu index="admin">
              <template #title>
                <el-icon><Setting /></el-icon>
                <span>系统管理</span>
              </template>
              
              <el-menu-item index="/admin/users">
                <el-icon><User /></el-icon>
                <span>用户管理</span>
              </el-menu-item>
              
              <el-menu-item index="/admin/permissions">
                <el-icon><Lock /></el-icon>
                <span>权限管理</span>
              </el-menu-item>
              
              <el-menu-item index="/admin/invite-codes">
                <el-icon><Ticket /></el-icon>
                <span>邀请码管理</span>
              </el-menu-item>
              
              <el-menu-item index="/admin/monitor">
                <el-icon><Monitor /></el-icon>
                <span>系统监控</span>
              </el-menu-item>
            </el-sub-menu>
          </template>
          
          <!-- 系统设置 - 所有用户可见，但内容可能不同 -->
          <el-sub-menu index="system">
            <template #title>
              <el-icon><Tools /></el-icon>
              <span>系统设置</span>
            </template>
            
            <el-menu-item 
              v-if="hasPermission('profile:manage')" 
              index="/profile/info"
            >
              <el-icon><UserFilled /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
            
            <el-menu-item 
              v-if="hasPermission('profile:manage')" 
              index="/profile/password"
            >
              <el-icon><Lock /></el-icon>
              <span>修改密码</span>
            </el-menu-item>
            
            <el-menu-item 
              v-if="hasPermission('system:manage')" 
              index="/system/settings"
            >
              <el-icon><Setting /></el-icon>
              <span>系统配置</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
      
      <!-- 折叠按钮 -->
      <div class="collapse-trigger" @click="toggleCollapse">
        <el-icon :size="20">
          <component :is="isCollapse ? 'Expand' : 'Fold'" />
        </el-icon>
      </div>
    </el-aside>
    
    <el-container>
      <!-- 顶部状态栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-button 
            link
            class="toggle-btn"
            @click="toggleCollapse"
          >
            <el-icon :size="20">
              <component :is="isCollapse ? 'Expand' : 'Fold'" />
            </el-icon>
          </el-button>
          
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPath }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-space>
            <el-button link class="icon-btn">
              <el-badge :value="3">
                <el-icon :size="20"><Bell /></el-icon>
              </el-badge>
            </el-button>
            
            <el-dropdown trigger="click">
              <div class="user-info">
                <el-avatar :size="32" :src="userAvatar">
                  {{ user?.username?.charAt(0)?.toUpperCase() }}
                </el-avatar>
                <span class="username">{{ user?.username }}</span>
                <el-icon><CaretBottom /></el-icon>
              </div>
              
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-icon><User /></el-icon>个人中心
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-icon><Setting /></el-icon>账户设置
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-space>
        </div>
      </el-header>
      
      <!-- 主要内容区 -->
      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition 
            name="fade"
            mode="out-in"
            appear
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Monitor,
  TrendCharts,
  SetUp,
  Wallet,
  List,
  Setting,
  User,
  Lock,
  Ticket,
  Tools,
  UserFilled,
  CaretBottom,
  Expand,
  Fold,
  SwitchButton
} from '@element-plus/icons-vue'
import { stopSessionMonitor } from '@/utils/auth'

const store = useStore()
const router = useRouter()
const route = useRoute()

const isCollapse = ref(false)
const userAvatar = ref('')

const user = computed(() => {
  console.log('Current user state:', store.state.user) // 添加调试日志
  return store.state.user
})

const activeMenu = computed(() => route.path)
const currentPath = computed(() => {
  const pathMap = {
    '/': '仪表盘',
    '/trade/strategy': '策略管理',
    '/trade/positions': '持仓管理',
    '/trade/orders': '订单管理',
    '/system/account': '账户设置',
    '/system/security': '安全设置'
  }
  return pathMap[route.path] || '仪表盘'
})

const isAdmin = computed(() => {
  const isAdmin = store.state.user?.role === 'admin'
  console.log('Is admin:', isAdmin, 'User role:', store.state.user?.role) // 添加调试日志
  return isAdmin
})

const hasPermission = (permission) => {
  if (isAdmin.value) return true
  const userPermissions = store.state.user?.permissions || []
  console.log('Checking permission:', permission, 'Permissions:', userPermissions) // 添加调试日志
  return userPermissions.includes(permission)
}

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const goHome = () => {
  router.push('/')
}

const handleLogout = async () => {
  try {
    // 停止会话监控
    stopSessionMonitor()
    
    // 清除登录状态
    localStorage.removeItem('token')
    store.dispatch('clearUser')
    
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    ElMessage.error('退出登录失败')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background-color: #f5f7fa;
}

.aside {
  background-color: #fff;
  color: #333;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.logo-container {
  height: 64px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s;
}

.logo-container:hover {
  background-color: #f5f7fa;
}

.logo {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo-container h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
}

.menu {
  border-right: none;
  background-color: transparent;
  flex: 1;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
  color: #333;
  font-size: 14px;
}

:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  color: #666;
  font-size: 18px;
  margin-right: 12px;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: #f5f7fa !important;
  color: var(--el-color-primary);
}

:deep(.el-menu-item:hover .el-icon),
:deep(.el-sub-menu__title:hover .el-icon) {
  color: var(--el-color-primary);
}

:deep(.el-menu-item.is-active) {
  background-color: #e6f7ff !important;
  color: var(--el-color-primary);
  border-right: 3px solid var(--el-color-primary);
}

:deep(.el-menu-item.is-active .el-icon) {
  color: var(--el-color-primary);
}

:deep(.el-sub-menu.is-active .el-sub-menu__title) {
  color: var(--el-color-primary);
}

:deep(.el-sub-menu.is-active .el-sub-menu__title .el-icon) {
  color: var(--el-color-primary);
}

.collapse-trigger {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
  border-top: 1px solid #f0f0f0;
  background-color: #fff;
}

.collapse-trigger:hover {
  background-color: #f5f7fa;
  color: var(--el-color-primary);
}

/* 子菜单样式 */
:deep(.el-menu--popup) {
  min-width: 200px;
  border-radius: 4px;
  padding: 8px 0;
}

:deep(.el-menu--popup .el-menu-item) {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
}

:deep(.el-menu--popup .el-menu-item:hover) {
  background-color: #f5f7fa;
}

:deep(.el-menu--popup .el-menu-item.is-active) {
  background-color: #e6f7ff;
}

/* 滚动条样式 */
:deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}

:deep(.el-scrollbar__thumb) {
  background-color: #dcdfe6;
}

:deep(.el-scrollbar__thumb:hover) {
  background-color: #c0c4cc;
}

/* 折叠菜单样式 */
:deep(.el-menu--collapse) {
  width: 64px;
}

:deep(.el-menu--collapse .el-sub-menu__title) {
  padding: 0 20px !important;
}

:deep(.el-menu--collapse .el-menu-item) {
  padding: 0 20px !important;
}

:deep(.el-menu--collapse .el-menu-item .el-icon),
:deep(.el-menu--collapse .el-sub-menu__title .el-icon) {
  margin: 0;
  font-size: 18px;
}

/* 菜单项间距 */
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  margin: 4px 0;
  border-radius: 4px;
  margin-right: 8px;
  margin-left: 8px;
}

/* 子菜单缩进 */
:deep(.el-menu--inline .el-menu-item) {
  padding-left: 48px !important;
}

/* 菜单分组标题 */
:deep(.el-menu-item-group__title) {
  padding: 8px 20px;
  font-size: 12px;
  color: #909399;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toggle-btn {
  padding: 0 12px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
}

.toggle-btn:hover {
  color: var(--el-color-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-btn {
  padding: 8px;
  color: #666;
  height: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0 8px;
  height: 40px;
  border-radius: 4px;
  transition: all 0.3s;
}

.user-info:hover {
  background: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #666;
  margin-right: 4px;
}

.main {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 4px;
}

/* 卡片样式 */
:deep(.el-card) {
  border-radius: 4px;
  border: none;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  transition: all 0.3s;
}

:deep(.el-card:hover) {
  box-shadow: 0 4px 12px rgba(0, 21, 41, 0.12);
}

/* 添加页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 添加菜单展开/折叠动画 */
.el-menu-vertical-collapse {
  width: 64px;
}

.el-menu-vertical {
  width: 240px;
}

.el-menu--collapse {
  width: 64px !important;
}

.el-menu--collapse > .el-menu-item [class^="el-icon-"] {
  margin: 0;
  vertical-align: middle;
  width: 24px;
  text-align: center;
}

.el-menu--collapse > .el-menu-item .el-submenu__icon-arrow {
  display: none;
}
</style> 