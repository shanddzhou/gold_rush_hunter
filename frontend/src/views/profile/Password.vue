<template>
  <div class="password-container">
    <el-form 
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="120px"
    >
      <el-form-item label="当前密码" prop="oldPassword">
        <el-input 
          v-model="form.oldPassword"
          type="password"
          show-password
        />
      </el-form-item>
      
      <el-form-item label="新密码" prop="newPassword">
        <el-input 
          v-model="form.newPassword"
          type="password"
          show-password
        />
      </el-form-item>
      
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input 
          v-model="form.confirmPassword"
          type="password"
          show-password
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          修改密码
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { changePassword } from '@/api/users'

const router = useRouter()
const store = useStore()
const formRef = ref(null)
const loading = ref(false)

// 表单数据
const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 验证新密码与确认密码是否一致
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.value.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 验证新密码不能与当前密码相同
const validateNewPassword = (rule, value, callback) => {
  if (value === form.value.oldPassword) {
    callback(new Error('新密码不能与当前密码相同'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' },
    { validator: validateNewPassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    await changePassword({
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword
    })
    
    ElMessage.success('密码修改成功，请重新登录')
    // 清除登录状态
    store.dispatch('clearUser')
    localStorage.removeItem('token')
    // 跳转到登录页
    router.push('/login')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '密码修改失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.password-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
</style> 