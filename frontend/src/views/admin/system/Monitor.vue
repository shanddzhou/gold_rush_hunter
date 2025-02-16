<template>
  <div class="system-monitor">
    <div class="header">
      <h2>系统监控</h2>
      <el-button type="primary" @click="refreshData">
        <el-icon><Refresh /></el-icon>刷新
      </el-button>
    </div>
    
    <el-row :gutter="20" class="dashboard">
      <!-- 系统资源卡片 -->
      <el-col :span="8">
        <el-card class="resource-card">
          <template #header>
            <div class="card-header">
              <span>系统资源</span>
              <el-tag 
                :type="systemStatus === 'normal' ? 'success' : 'danger'"
              >
                {{ systemStatus === 'normal' ? '正常' : '异常' }}
              </el-tag>
            </div>
          </template>
          
          <div class="metrics">
            <div class="metric-item">
              <span class="label">CPU 使用率</span>
              <el-progress 
                :percentage="systemData.cpu_usage" 
                :status="getCpuStatus"
              />
            </div>
            
            <div class="metric-item">
              <span class="label">内存使用率</span>
              <el-progress 
                :percentage="systemData.memory_usage"
                :status="getMemoryStatus"
              />
            </div>
            
            <div class="metric-item">
              <span class="label">磁盘使用率</span>
              <el-progress 
                :percentage="systemData.disk_usage"
                :status="getDiskStatus"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 数据库状态卡片 -->
      <el-col :span="8">
        <el-card class="database-card">
          <template #header>
            <div class="card-header">
              <span>数据库状态</span>
              <el-tag 
                :type="dbLatency < 100 ? 'success' : 'warning'"
              >
                {{ dbLatency }}ms
              </el-tag>
            </div>
          </template>
          
          <div class="db-info">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="响应时间">
                {{ dbLatency }}ms
              </el-descriptions-item>
              <el-descriptions-item label="连接状态">
                <el-tag :type="dbLatency < 1000 ? 'success' : 'danger'">
                  {{ dbLatency < 1000 ? '正常' : '异常' }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
      
      <!-- 服务状态卡片 -->
      <el-col :span="8">
        <el-card class="services-card">
          <template #header>
            <div class="card-header">
              <span>服务状态</span>
            </div>
          </template>
          
          <div class="services-list">
            <div 
              v-for="(status, service) in services" 
              :key="service"
              class="service-item"
            >
              <span class="service-name">{{ service }}</span>
              <el-tag :type="status ? 'success' : 'danger'">
                {{ status ? '运行中' : '已停止' }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getSystemHealth } from '@/api/system'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

const systemData = ref({
  cpu_usage: 0,
  memory_usage: 0,
  disk_usage: 0
})
const dbLatency = ref(0)
const services = ref({})
let refreshTimer = null

// 获取系统状态
const fetchSystemHealth = async () => {
  try {
    const data = await getSystemHealth()
    systemData.value = data.system
    dbLatency.value = data.db_latency
    services.value = data.services
  } catch (error) {
    console.error('Failed to fetch system health:', error)
    ElMessage.error('获取系统状态失败')
  }
}

// 计算系统整体状态
const systemStatus = computed(() => {
  const { cpu_usage, memory_usage, disk_usage } = systemData.value
  return cpu_usage < 80 && memory_usage < 80 && disk_usage < 80 
    ? 'normal' 
    : 'warning'
})

// 获取各指标状态
const getCpuStatus = computed(() => getMetricStatus(systemData.value.cpu_usage))
const getMemoryStatus = computed(() => getMetricStatus(systemData.value.memory_usage))
const getDiskStatus = computed(() => getMetricStatus(systemData.value.disk_usage))

// 判断指标状态
const getMetricStatus = (value) => {
  if (value >= 90) return 'exception'
  if (value >= 70) return 'warning'
  return 'success'
}

// 手动刷新数据
const refreshData = () => {
  fetchSystemHealth()
}

// 组件挂载时开始定时刷新
onMounted(() => {
  fetchSystemHealth()
  refreshTimer = setInterval(fetchSystemHealth, 60000) // 每分钟刷新一次
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<style scoped>
.system-monitor {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.dashboard {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metrics {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 14px;
  color: #666;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.service-item:last-child {
  border-bottom: none;
}

.service-name {
  font-size: 14px;
  color: #333;
}
</style> 