<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  // 检查 token 和用户信息
  const token = localStorage.getItem('token')
  if (token && !userStore.user) {
    userStore.clearUser()
    router.push('/login')
  }
})
</script>

<style>
#app {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  margin: 0;
  padding: 0;
  color: #2c3e50;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #f5f7fa;
}

/* Element Plus 全局样式覆盖 */
:root {
  --el-color-primary: #1890ff;
  --el-color-success: #52c41a;
  --el-color-warning: #faad14;
  --el-color-danger: #ff4d4f;
  --el-border-radius-base: 4px;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 10;
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: #f5f7fa;
}
</style> 