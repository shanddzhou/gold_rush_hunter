<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <img src="@/assets/logo.png" alt="GoldRush" class="logo" />
        <h1>欢迎注册</h1>
        <p class="subtitle">GoldRush Hunter 量化交易系统</p>
      </div>
      
      <el-form 
        :model="form"
        :rules="rules"
        ref="formRef"
        class="register-form"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="form.username"
            placeholder="请输入用户名（3-20个字符）"
            :prefix-icon="User"
            size="large"
            clearable
          />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input 
                v-model="form.password"
                type="password"
                placeholder="请输入密码（至少6位）"
                show-password
                :prefix-icon="Lock"
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input 
                v-model="form.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                show-password
                :prefix-icon="Lock"
                size="large"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input 
                v-model="form.email"
                placeholder="邮箱（选填）"
                :prefix-icon="Message"
                size="large"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input 
                v-model="form.phone"
                placeholder="手机号（选填）"
                :prefix-icon="Phone"
                size="large"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="邀请码" prop="invite_code">
          <el-input 
            v-model="form.invite_code"
            placeholder="请输入邀请码"
            :prefix-icon="Key"
            size="large"
            clearable
          />
        </el-form-item>
        
        <el-form-item class="register-button">
          <el-button 
            type="primary" 
            @click="handleSubmit" 
            :loading="loading"
            size="large"
            class="submit-btn"
          >
            立即注册
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-link">
        已有账号？ <router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/auth'
import { ElMessage } from 'element-plus'
import { User, Lock, Message, Phone, Key } from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

// 表单数据
const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
  invite_code: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度必须在 3-20 个字符之间', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]+$/, message: '用户名只能包含字母、数字、下划线和连字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== form.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号码', trigger: 'blur' }
  ],
  invite_code: [
    { required: true, message: '邀请码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '邀请码长度不正确', trigger: 'blur' }
  ]
}

// 提交处理
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    await register({
      username: form.value.username,
      password: form.value.password,
      email: form.value.email || undefined,
      phone: form.value.phone || undefined,
      invite_code: form.value.invite_code
    })
    
    ElMessage({
      type: 'success',
      message: '注册成功，即将跳转到登录页面',
      duration: 2000
    })
    
    // 延迟跳转，让用户看到成功提示
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (error) {
    console.error('Register error:', error)
    
    // 优化错误提示
    let errorMessage = '注册失败'
    if (error.response?.data?.message) {
      switch (error.response.data.message) {
        case '用户名已存在':
          errorMessage = '该用户名已被注册，请更换其他用户名'
          break
        case '邀请码不能为空':
          errorMessage = '请输入有效的邀请码'
          break
        case '无效的邀请码':
          errorMessage = '邀请码无效或已被使用，请确认后重试'
          break
        default:
          errorMessage = error.response.data.message
      }
    }
    
    ElMessage({
      type: 'error',
      message: errorMessage,
      duration: 3000
    })
    
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
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

.register-box {
  width: 520px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.register-header h1 {
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

.register-form {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  padding-bottom: 8px;
  font-weight: 500;
  color: #333;
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

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  background: linear-gradient(45deg, #1a237e, #0d47a1);
  border: none;
  margin-top: 16px;
}

.submit-btn:hover {
  background: linear-gradient(45deg, #0d47a1, #1a237e);
  opacity: 0.9;
}

.login-link {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #1a237e;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 576px) {
  .register-box {
    width: 100%;
    padding: 20px;
  }
  
  .el-row {
    margin: 0 !important;
  }
  
  .el-col {
    padding: 0 !important;
    width: 100% !important;
  }
}

/* 添加表单提示样式 */
.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

/* 优化错误提示样式 */
:deep(.el-form-item__error) {
  color: #f56c6c;
  font-size: 13px;
  margin-top: 4px;
  position: static;
  padding-left: 0;
}

/* 添加输入框错误状态样式 */
:deep(.el-input__wrapper.is-error) {
  box-shadow: 0 0 0 1px #f56c6c !important;
}

:deep(.el-input__wrapper.is-error:hover) {
  box-shadow: 0 0 0 1px #f56c6c !important;
}
</style> 