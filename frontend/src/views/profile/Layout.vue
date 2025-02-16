<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="info">
          <router-view v-if="activeTab === 'info'" />
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="password">
          <router-view v-if="activeTab === 'password'" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeTab = ref('info')

// 根据路由路径设置当前标签
watch(() => route.path, (path) => {
  if (path.includes('password')) {
    activeTab.value = 'password'
  } else {
    activeTab.value = 'info'
  }
}, { immediate: true })

// 标签切换时更新路由
watch(activeTab, (tab) => {
  router.push(`/profile/${tab}`)
})
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
}
</style> 