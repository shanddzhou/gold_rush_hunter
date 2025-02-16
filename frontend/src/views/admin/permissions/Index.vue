<template>
  <div class="permissions">
    <div class="header">
      <h2>权限管理</h2>
      <el-button type="primary" @click="showCreateDialog">
        <el-icon><Plus /></el-icon>新增角色
      </el-button>
    </div>
    
    <!-- 角色列表 -->
    <el-table 
      :data="roles" 
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
    >
      <el-table-column prop="name" label="角色名称" width="150">
        <template #default="{ row }">
          <el-tag :type="row.name === 'admin' ? 'danger' : 'info'">
            {{ row.name }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="description" label="描述" />
      
      <el-table-column prop="permissions" label="权限" width="300">
        <template #default="{ row }">
          <el-tag 
            v-for="perm in row.permissions" 
            :key="perm"
            size="small"
            style="margin-right: 5px; margin-bottom: 5px;"
          >
            {{ perm }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button 
            type="primary" 
            link
            :disabled="row.name === 'admin'"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button 
            type="danger" 
            link
            :disabled="row.name === 'admin'"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 角色编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form 
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" :disabled="!!currentId" />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="form.description"
            type="textarea"
            :rows="2"
          />
        </el-form-item>
        
        <el-form-item label="权限" prop="permissions">
          <el-checkbox-group v-model="form.permissions">
            <el-checkbox 
              v-for="perm in availablePermissions"
              :key="perm.value"
              :label="perm.value"
            >
              {{ perm.label }}
            </el-checkbox>
          </el-checkbox-group>
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
import { Plus } from '@element-plus/icons-vue'
import { getRoles, createRole, updateRole, deleteRole } from '@/api/permissions'

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const formRef = ref(null)
const roles = ref([])
const currentId = ref(null)

// 表单数据
const form = ref({
  name: '',
  description: '',
  permissions: []
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '角色名称只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入角色描述', trigger: 'blur' }
  ],
  permissions: [
    { type: 'array', required: true, message: '请选择权限', trigger: 'change' }
  ]
}

// 可用权限列表
const availablePermissions = [
  { label: '用户管理', value: 'user:manage' },
  { label: '角色管理', value: 'role:manage' },
  { label: '邀请码管理', value: 'invite:manage' },
  { label: '交易管理', value: 'trade:manage' },
  { label: '系统设置', value: 'system:manage' }
]

// 对话框标题
const dialogTitle = computed(() => currentId.value ? '编辑角色' : '新增角色')

// 获取角色列表
const fetchRoles = async () => {
  try {
    loading.value = true
    const response = await getRoles()
    
    // 检查响应数据
    if (!Array.isArray(response)) {
      throw new Error('Invalid response format')
    }
    
    roles.value = response.map(role => ({
      ...role,
      permissions: role.permissions || []  // 确保权限字段不为 null
    }))
  } catch (error) {
    console.error('Error fetching roles:', error)
    ElMessage.error(error.response?.data?.message || '获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 显示创建对话框
const showCreateDialog = () => {
  currentId.value = null
  form.value = {
    name: '',
    description: '',
    permissions: []
  }
  dialogVisible.value = true
}

// 编辑角色
const handleEdit = (role) => {
  currentId.value = role.id
  form.value = {
    name: role.name,
    description: role.description,
    permissions: role.permissions
  }
  dialogVisible.value = true
}

// 保存角色
const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    saving.value = true
    
    if (currentId.value) {
      await updateRole(currentId.value, form.value)
    } else {
      await createRole(form.value)
    }
    
    ElMessage.success('保存成功')
    dialogVisible.value = false
    await fetchRoles()
  } catch (error) {
    console.error('Failed to save role:', error)
    ElMessage.error(error.response?.data?.message || '保存失败')
  } finally {
    saving.value = false
  }
}

// 删除角色
const handleDelete = async (role) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该角色吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteRole(role.id)
    ElMessage.success('删除成功')
    await fetchRoles()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete role:', error)
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  fetchRoles()
})
</script>

<style scoped>
.permissions {
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
</style> 