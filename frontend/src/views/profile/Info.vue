<template>
  <div class="info-container">
    <el-form 
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="100px"
    >
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      
      <el-form-item label="用户名">
        <el-input v-model="form.username" disabled />
      </el-form-item>
      
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          保存修改
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getCurrentUser, updateProfile } from '@/api/users'
import { useStore } from 'vuex'
import { formatPhone } from '@/utils/format'

const store = useStore()
const formRef = ref(null)
const loading = ref(false)

// 表单数据
const form = ref({
  username: '',
  email: '',
  phone: '',
  avatar: ''
})

// 表单验证规则
const rules = {
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 上传相关配置
const uploadUrl = `${process.env.VUE_APP_BASE_API}/users/avatar`
const headers = {
  Authorization: `Bearer ${localStorage.getItem('token')}`
}

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    loading.value = true
    const user = await getCurrentUser()
    form.value = {
      username: user.username,
      email: user.email || '',
      phone: user.phone || '',
      avatar: user.avatar || ''
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const { user } = await updateProfile({
      email: form.value.email,
      phone: form.value.phone
    })
    
    ElMessage.success('保存成功')
    // 更新 Vuex 中的用户信息
    store.dispatch('setUser', user)
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '保存失败')
  } finally {
    loading.value = false
  }
}

// 头像上传成功
const handleAvatarSuccess = (response) => {
  form.value.avatar = response.url
  store.dispatch('setUser', { ...store.state.user, avatar: response.url })
  ElMessage.success('头像上传成功')
}

// 头像上传前的验证
const beforeAvatarUpload = (file) => {
  const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }

  return isImage && isLt2M
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.info-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.avatar-uploader {
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
}

.avatar-uploader-icon:hover {
  border-color: #409EFF;
}
</style> 