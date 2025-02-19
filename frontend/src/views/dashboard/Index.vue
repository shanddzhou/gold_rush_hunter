<template>
  <div class="dashboard">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <h3>欢迎回来，{{ userStore.user?.username }}</h3>
        </div>
      </template>
      <div class="dashboard-content">
        <p>今天是 {{ currentDate }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const currentDate = ref(new Date().toLocaleDateString('zh-CN'))
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 