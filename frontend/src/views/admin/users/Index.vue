<template>
  <div class="users">
    <div class="header">
      <h2>用户管理</h2>
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户"
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <el-table 
      :data="filteredUsers" 
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
    >
      <el-table-column prop="username" label="用户名" width="120" />
      
      <el-table-column prop="email" label="邮箱" width="180">
        <template #default="{ row }">
          <span>{{ row.email || '-' }}</span>
        </template>
      </el-table-column>
      
      <el-table-column prop="phone" label="手机号" width="120">
        <template #default="{ row }">
          <span>{{ row.phone || '-' }}</span>
        </template>
      </el-table-column>
      
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'info'">
            {{ row.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
            {{ row.status === 'active' ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="created_at" label="注册时间" width="180">
        <template #default="{ row }">
          <span>{{ formatDate(row.created_at) }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" fixed="right" width="200">
        <template #default="{ row }">
          <el-button 
            type="primary" 
            link
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button 
            :type="row.status === 'active' ? 'danger' : 'success'" 
            link
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'active' ? '禁用' : '启用' }}
          </el-button>
          <el-button 
            type="warning" 
            link
            @click="handleResetPassword(row)"
          >
            重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form 
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" disabled />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getUsers, updateUser, toggleUserStatus, resetUserPassword } from '@/api/users'

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const formRef = ref(null)
const users = ref([])
const searchQuery = ref('')
const currentUserId = ref(null)

// 表单数据
const form = ref({
  username: '',
  email: '',
  phone: '',
  role: 'user'
})

// 表单验证规则
const rules = {
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ]
}

// 过滤用户列表
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.username.toLowerCase().includes(query) ||
    (user.email && user.email.toLowerCase().includes(query)) ||
    (user.phone && user.phone.includes(query))
  )
})

// 对话框标题
const dialogTitle = computed(() => currentUserId.value ? '编辑用户' : '新增用户')

// 获取用户列表
const fetchUsers = async () => {
  try {
    loading.value = true
    const data = await getUsers()
    users.value = data
  } catch (error) {
    console.error('Failed to fetch users:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 编辑用户
const handleEdit = (user) => {
  currentUserId.value = user.id
  form.value = {
    username: user.username,
    email: user.email || '',
    phone: user.phone || '',
    role: user.role
  }
  dialogVisible.value = true
}

// 保存用户
const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    saving.value = true
    
    await updateUser(currentUserId.value, form.value)
    ElMessage.success('保存成功')
    dialogVisible.value = false
    await fetchUsers()
  } catch (error) {
    console.error('Failed to save user:', error)
    ElMessage.error(error.response?.data?.message || '保存失败')
  } finally {
    saving.value = false
  }
}

// 切换用户状态
const handleToggleStatus = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要${user.status === 'active' ? '禁用' : '启用'}该用户吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await toggleUserStatus(user.id)
    ElMessage.success('操作成功')
    await fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to toggle user status:', error)
      ElMessage.error('操作失败')
    }
  }
}

// 重置密码
const handleResetPassword = async (user) => {
  try {
    await ElMessageBox.confirm(
      '确定要重置该用户的密码吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const { password } = await resetUserPassword(user.id)
    ElMessageBox.alert(
      `新密码: ${password}`,
      '密码重置成功',
      {
        confirmButtonText: '确定',
        callback: () => {
          // 可以实现复制到剪贴板的功能
        }
      }
    )
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to reset password:', error)
      ElMessage.error('重置密码失败')
    }
  }
}

// 格式化日期
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString()
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.users {
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

.search-input {
  width: 300px;
}
</style> 