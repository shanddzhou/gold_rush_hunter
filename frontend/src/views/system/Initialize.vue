<template>
  <div class="initialize-container">
    <div class="initialize-box">
      <div class="header">
        <h2>系统初始化</h2>
        <p>请完成系统初始化配置</p>
      </div>

      <el-steps :active="currentStep" finish-status="success" class="steps">
        <el-step title="数据库配置" />
        <el-step title="管理员配置" />
      </el-steps>

      <!-- 数据库配置表单 -->
      <el-form
        v-if="currentStep === 0"
        ref="dbFormRef"
        :model="dbForm"
        :rules="dbRules"
        label-width="120px"
        class="form"
      >
        <el-form-item label="数据库地址" prop="host">
          <el-input v-model="dbForm.host" placeholder="例如：localhost" />
        </el-form-item>

        <el-form-item label="端口" prop="port">
          <el-input v-model.number="dbForm.port" placeholder="例如：5432" />
        </el-form-item>

        <el-form-item label="数据库名称" prop="database">
          <el-input v-model="dbForm.database" placeholder="例如：goldrush" />
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="dbForm.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="dbForm.password" type="password" show-password />
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleDbNext" 
            :loading="testing"
          >
            下一步
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 管理员配置表单 -->
      <el-form
        v-else
        ref="adminFormRef"
        :model="adminForm"
        :rules="adminRules"
        label-width="120px"
        class="form"
      >
        <el-form-item label="管理员用户名" prop="username">
          <el-input v-model="adminForm.username" placeholder="请输入管理员用户名" />
        </el-form-item>

        <el-form-item label="管理员密码" prop="password">
          <el-input v-model="adminForm.password" type="password" placeholder="请输入管理员密码" show-password />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="adminForm.confirmPassword" type="password" placeholder="请确认密码" show-password />
        </el-form-item>

        <el-form-item>
          <el-button @click="prevStep">上一步</el-button>
          <el-button type="primary" @click="handleInitialize" :loading="initializing">
            完成初始化
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { testDatabase, initializeSystem, checkSystemStatus } from '@/api/system'
import logger from '@/utils/logger'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const currentStep = ref(0)
const testing = ref(false)
const initializing = ref(false)
const dbFormRef = ref(null)
const adminFormRef = ref(null)

const dbForm = reactive({
  host: '',
  port: 5432,
  database: '',
  username: '',
  password: ''
})

// 管理员配置表单
const adminForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// 数据库配置验证规则
const dbRules = {
  host: [{ required: true, message: '请输入数据库地址', trigger: 'blur' }],
  port: [
    { required: true, message: '请输入端口号', trigger: 'blur' },
    { type: 'number', message: '端口号必须为数字', trigger: 'blur' }
  ],
  database: [{ required: true, message: '请输入数据库名称', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 验证确认密码
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== adminForm.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 管理员配置验证规则
const adminRules = {
  username: [
    { required: true, message: '请输入管理员用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能小于3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入管理员密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 处理数据库配置下一步
const handleDbNext = async () => {
  if (!dbFormRef.value) return
  
  try {
    // 表单验证
    await dbFormRef.value.validate()
    
    // 测试数据库连接
    testing.value = true
    const { success, message, details } = await testDatabase({
      db_config: { ...dbForm }
    })
    
    if (success) {
      logger.info('Database connection test successful')
      currentStep.value = 1 // 进入管理员配置
    } else {
      // 显示详细错误信息
      ElMessageBox.alert(
        `<div class="error-details">
          <p class="error-message">${message}</p>
          ${details ? `
            <div class="error-tips">
              <p class="tips-title">可能的原因和解决方案：</p>
              <ul>
                ${details.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>`,
        '数据库连接失败',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          customClass: {
            container: 'custom-error-dialog'
          }
        }
      )
    }
  } catch (error) {
    logger.error('Database connection test failed', error)
    ElMessage.error('数据库连接测试失败')
  } finally {
    testing.value = false
  }
}

// 上一步
const prevStep = () => {
  currentStep.value--
}

// 完成初始化
const handleInitialize = async () => {
  if (!adminFormRef.value) return
  
  try {
    await adminFormRef.value.validate()
    initializing.value = true
    
    await initializeSystem({
      db_config: dbForm,
      admin_config: {
        username: adminForm.value.username,
        password: adminForm.value.password
      }
    })
    
    ElMessage.success('系统初始化成功')
    router.push('/login')
  } catch (error) {
    console.error('System initialization failed:', error)
    ElMessage.error(error.response?.data?.message || '系统初始化失败')
  } finally {
    initializing.value = false
  }
}

onMounted(async () => {
  try {
    const { initialized } = await checkSystemStatus()
    if (initialized) {
      ElMessage.warning('系统已初始化')
      router.push('/')
    }
  } catch (error) {
    console.error('Failed to check system status:', error)
  }
})
</script>

<style scoped>
.initialize-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  padding: 20px;
}

.initialize-box {
  width: 600px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  color: #1a237e;
}

.header p {
  margin: 10px 0 0;
  color: #666;
}

.steps {
  margin-bottom: 30px;
}

.form {
  max-width: 500px;
  margin: 0 auto;
}

:deep(.el-form-item__content) {
  justify-content: flex-end;
}

/* 错误提示框样式 */
.error-details {
  text-align: left;
}

.error-message {
  color: #f56c6c;
  font-size: 16px;
  margin-bottom: 12px;
}

.error-tips {
  background-color: #fdf6ec;
  padding: 12px;
  border-radius: 4px;
}

.tips-title {
  color: #e6a23c;
  font-weight: bold;
  margin-bottom: 8px;
}

.error-tips ul {
  margin: 0;
  padding-left: 20px;
}

.error-tips li {
  color: #666;
  line-height: 1.8;
}

/* 自定义对话框样式 */
.custom-error-dialog {
  width: 500px;
}
</style> 