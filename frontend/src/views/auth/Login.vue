<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="@/assets/logo.png" alt="GoldRush" class="logo" />
        <h1>GoldRush Hunter</h1>
        <p class="subtitle">量化交易系统</p>
      </div>
      
      <el-form 
        :model="form"
        :rules="rules"
        ref="formRef"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="form.username"
            placeholder="用户名"
            :prefix-icon="User"
            size="large"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="form.password"
            type="password"
            placeholder="密码"
            show-password
            :prefix-icon="Lock"
            size="large"
            @keyup.enter="handleSubmit"
          />
        </el-form-item>
        
        <el-form-item class="login-button">
          <el-button 
            type="primary" 
            @click="handleSubmit" 
            :loading="loading"
            size="large"
            class="submit-btn"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="register-link">
        还没有账号？ <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { login, getInfo } from '@/api/auth'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { startSessionMonitor } from '@/utils/auth'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

// 表单数据
const form = ref({
  username: '',
  password: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

// 提交处理
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const { token } = await login(form.value)
    userStore.setToken(token)
    
    // 获取用户信息
    const userInfo = await getInfo()
    userStore.setUser(userInfo)
    
    // 启动会话监控
    startSessionMonitor()
    
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
    ElMessage.error(error.response?.data?.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
}

.login-box {
  width: 420px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.login-header h1 {
  margin: 0;
  font-size: 28px;
  color: #1a237e;
  font-weight: 600;
}

.subtitle {
  margin: 8px 0 0;
  color: #666;
  font-size: 16px;
}

.login-form {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 !important;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #1a237e !important;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #1a237e !important;
}

:deep(.el-input__inner) {
  height: 44px;
}

:deep(.el-input__prefix) {
  font-size: 18px;
  color: #909399;
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  border: none;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.2);
}

.register-link {
  text-align: center;
  color: #666;
}

.register-link a {
  color: #1a237e;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.register-link a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-box {
    width: 100%;
    padding: 30px 20px;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 14px;
  }
}
</style> 