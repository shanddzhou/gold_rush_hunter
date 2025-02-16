<template>
  <div class="invite-codes">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>邀请码管理</span>
          <el-button type="primary" @click="handleCreate">
            生成邀请码
          </el-button>
        </div>
      </template>
      
      <el-table 
        v-loading="loading"
        :data="inviteCodes"
        style="width: 100%"
      >
        <el-table-column prop="code" label="邀请码" width="180" />
        <el-table-column prop="creator" label="创建者" width="120" />
        <el-table-column prop="max_uses" label="最大使用次数" width="120" />
        <el-table-column prop="current_uses" label="已使用次数" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_valid ? 'success' : 'info'">
              {{ row.is_valid ? '有效' : '已失效' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="used_by" label="使用者" width="120" />
        <el-table-column prop="used_at" label="使用时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.used_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="expired_at" label="过期时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.expired_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button 
              type="danger" 
              link
              :disabled="!row.is_valid || row.current_uses > 0"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 生成邀请码对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="生成邀请码"
      width="500px"
    >
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="最大使用次数" prop="max_uses">
          <el-input-number 
            v-model="form.max_uses"
            :min="1"
            :max="100"
          />
        </el-form-item>
        <el-form-item label="有效期(天)" prop="expire_days">
          <el-input-number 
            v-model="form.expire_days"
            :min="1"
            :max="365"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getInviteCodes, generateInviteCode, deleteInviteCode } from '@/api/invite-codes'
import { formatDate } from '@/utils/format'

const loading = ref(false)
const inviteCodes = ref([])
const dialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref(null)

const form = ref({
  max_uses: 1,
  expire_days: 30
})

const rules = {
  max_uses: [
    { required: true, message: '请输入最大使用次数', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: '使用次数必须在1-100之间', trigger: 'blur' }
  ],
  expire_days: [
    { required: true, message: '请输入有效期', trigger: 'blur' },
    { type: 'number', min: 1, max: 365, message: '有效期必须在1-365天之间', trigger: 'blur' }
  ]
}

// 获取邀请码列表
const fetchInviteCodes = async () => {
  try {
    loading.value = true
    const data = await getInviteCodes()
    inviteCodes.value = data
  } catch (error) {
    ElMessage.error(error.message || '获取邀请码列表失败')
  } finally {
    loading.value = false
  }
}

// 生成邀请码
const handleCreate = () => {
  dialogVisible.value = true
  form.value = {
    max_uses: 1,
    expire_days: 30
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    const { invite_code } = await generateInviteCode(form.value)
    ElMessage.success('邀请码生成成功')
    dialogVisible.value = false
    
    // 刷新列表
    await fetchInviteCodes()
  } catch (error) {
    ElMessage.error(error.message || '生成邀请码失败')
  } finally {
    submitting.value = false
  }
}

// 删除邀请码
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这个邀请码吗？', '提示', {
      type: 'warning'
    })
    
    await deleteInviteCode(row.id)
    ElMessage.success('删除成功')
    
    // 刷新列表
    await fetchInviteCodes()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  fetchInviteCodes()
})
</script>

<style scoped>
.invite-codes {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 