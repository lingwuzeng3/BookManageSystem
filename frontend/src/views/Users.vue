<template>
  <div class="users">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd" :loading="loading">
            <el-icon><Plus /></el-icon>
            添加用户
          </el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-input
          v-model="searchForm.username"
          placeholder="请输入用户名"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="handleSearch"
        />
        <el-select
          v-model="searchForm.role"
          placeholder="请选择角色"
          style="width: 200px; margin-right: 10px;"
          clearable
          @change="handleSearch"
        >
          <el-option label="管理员" value="ADMIN" />
          <el-option label="用户" value="USER" />
        </el-select>
        <el-select
          v-model="searchForm.status"
          placeholder="请选择状态"
          style="width: 200px; margin-right: 10px;"
          clearable
          @change="handleSearch"
        >
          <el-option label="启用" value="ENABLED" />
          <el-option label="禁用" value="DISABLED" />
        </el-select>
        <el-button type="primary" @click="handleSearch" :loading="loading">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset" :loading="loading">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
      </div>

      <el-table
        :data="users"
        v-loading="loading"
        style="width: 100%; margin-top: 20px;"
        :default-sort="{ prop: 'id', order: 'ascending' }"
      >
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="username" label="用户名" sortable />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'ADMIN' ? 'danger' : 'primary'" size="small">
              {{ row.role === 'ADMIN' ? '管理员' : '用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ENABLED' ? 'success' : 'info'" size="small">
              {{ row.status === 'ENABLED' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" sortable />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)" :disabled="loading">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)" :disabled="loading">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!form.id">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%;">
            <el-option label="管理员" value="ADMIN" />
            <el-option label="用户" value="USER" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%;">
            <el-option label="启用" value="ENABLED" />
            <el-option label="禁用" value="DISABLED" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" :disabled="loading">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/users'
import { User } from '@/api'

const userStore = useUserStore()

const users = computed(() => userStore.users)
const loading = computed(() => userStore.loading)
const total = computed(() => userStore.total)
const currentPage = computed(() => userStore.currentPage)
const pageSize = computed(() => userStore.pageSize)

const searchForm = reactive({
  username: '',
  role: undefined as string | undefined,
  status: undefined as string | undefined
})

const dialogVisible = ref(false)
const dialogTitle = ref('添加用户')
const formRef = ref<FormInstance>()
const form = reactive<User>({
  username: '',
  password: '',
  role: 'USER',
  status: 'ENABLED'
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const handleSearch = () => {
  userStore.fetchUsers({
    page: 1,
    size: pageSize.value,
    username: searchForm.username || undefined,
    role: searchForm.role,
    status: searchForm.status
  })
}

const handleReset = () => {
  searchForm.username = ''
  searchForm.role = undefined
  searchForm.status = undefined
  userStore.clear()
  userStore.fetchUsers({
    page: 1,
    size: pageSize.value
  })
}

const handleAdd = () => {
  dialogTitle.value = '添加用户'
  dialogVisible.value = true
  resetForm()
}

const handleEdit = (row: User) => {
  dialogTitle.value = '编辑用户'
  dialogVisible.value = true
  Object.assign(form, row)
}

const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await userStore.deleteUser(row.id!)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (form.id) {
        await userStore.updateUser(form)
      } else {
        await userStore.createUser(form)
      }
      dialogVisible.value = false
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(form, {
    id: undefined,
    username: '',
    password: '',
    role: 'USER',
    status: 'ENABLED'
  })
}

const handleSizeChange = (val: number) => {
  userStore.fetchUsers({
    page: 1,
    size: val,
    username: searchForm.username || undefined,
    role: searchForm.role,
    status: searchForm.status
  })
}

const handleCurrentChange = (val: number) => {
  userStore.fetchUsers({
    page: val,
    size: pageSize.value,
    username: searchForm.username || undefined,
    role: searchForm.role,
    status: searchForm.status
  })
}

onMounted(() => {
  userStore.fetchUsers()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }
  
  .search-bar > * {
    width: 100% !important;
    margin-right: 0 !important;
  }
}
</style>