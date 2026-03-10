<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #409eff;">
              <el-icon><Reading /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ bookCount }}</div>
              <div class="stat-label">图书总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #67c23a;">
              <el-icon><Folder /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ categoryCount }}</div>
              <div class="stat-label">分类数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #e6a23c;">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ userCount }}</div>
              <div class="stat-label">用户数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #f56c6c;">
              <el-icon><Box /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ totalStock }}</div>
              <div class="stat-label">库存总量</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最新图书</span>
              <el-button type="primary" link @click="goToBooks">查看更多</el-button>
            </div>
          </template>
          <el-table :data="recentBooks" v-loading="loading" style="width: 100%;">
            <el-table-column prop="title" label="书名" />
            <el-table-column prop="author" label="作者" width="120" />
            <el-table-column prop="stock" label="库存" width="80">
              <template #default="{ row }">
                <el-tag :type="row.stock > 0 ? 'success' : 'danger'" size="small">
                  {{ row.stock }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统信息</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="系统名称">图书管理系统</el-descriptions-item>
            <el-descriptions-item label="系统版本">v1.0.0</el-descriptions-item>
            <el-descriptions-item label="开发框架">Spring Boot + Vue 3</el-descriptions-item>
            <el-descriptions-item label="数据库">MySQL</el-descriptions-item>
            <el-descriptions-item label="最后更新">{{ lastUpdateTime }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Reading, Folder, User, Box } from '@element-plus/icons-vue'
import { useBookStore } from '@/stores/books'
import { useCategoryStore } from '@/stores/categories'
import { useUserStore } from '@/stores/users'

const router = useRouter()
const bookStore = useBookStore()
const categoryStore = useCategoryStore()
const userStore = useUserStore()

const loading = computed(() => bookStore.loading || categoryStore.loading || userStore.loading)

const bookCount = computed(() => bookStore.books.length)
const categoryCount = computed(() => categoryStore.categories.length)
const userCount = computed(() => userStore.users.length)
const totalStock = computed(() => bookStore.books.reduce((sum, book) => sum + (book.stock || 0), 0))

const recentBooks = computed(() => {
  return bookStore.books.slice(0, 5)
})

const lastUpdateTime = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
})

const goToBooks = () => {
  router.push('/books')
}

onMounted(async () => {
  await Promise.all([
    bookStore.fetchBooks(),
    categoryStore.fetchCategories(),
    userStore.fetchUsers()
  ])
})
</script>

<style scoped>
.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: white;
  font-size: 28px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 768px) {
  .stat-content {
    padding: 5px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
    margin-right: 15px;
  }
  
  .stat-value {
    font-size: 24px;
  }
}
</style>