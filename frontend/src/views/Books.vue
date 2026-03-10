<template>
  <div class="books">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>图书管理</span>
          <el-button type="primary" @click="handleAdd" :loading="loading">
            <el-icon><Plus /></el-icon>
            添加图书
          </el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-input
          v-model="searchForm.title"
          placeholder="请输入书名"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="handleSearch"
        />
        <el-input
          v-model="searchForm.author"
          placeholder="请输入作者"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="handleSearch"
        />
        <el-select
          v-model="searchForm.categoryId"
          placeholder="请选择分类"
          style="width: 200px; margin-right: 10px;"
          clearable
          @change="handleSearch"
        >
          <el-option-group
            v-for="parentCategory in parentCategories"
            :key="parentCategory.id"
            :label="parentCategory.name"
          >
            <el-option
              :key="parentCategory.id"
              :label="parentCategory.name"
              :value="parentCategory.id"
              style="color: #409EFF; font-weight: bold;"
            />
            <el-option
              v-for="childCategory in getChildCategories(parentCategory.id)"
              :key="childCategory.id"
              :label="'  - ' + childCategory.name"
              :value="childCategory.id"
            />
          </el-option-group>
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
        :data="books"
        v-loading="loading"
        style="width: 100%; margin-top: 20px;"
        :default-sort="{ prop: 'id', order: 'ascending' }"
      >
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="title" label="书名" sortable />
        <el-table-column prop="author" label="作者" sortable />
        <el-table-column prop="isbn" label="ISBN" />
        <el-table-column prop="publisher" label="出版社" />
        <el-table-column prop="publishDate" label="出版日期" width="120" sortable />
        <el-table-column prop="stock" label="库存" width="80" sortable>
          <template #default="{ row }">
            <el-tag :type="row.stock > 0 ? 'success' : 'danger'" size="small">
              {{ row.stock }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            {{ getCategoryName(row.categoryId) }}
          </template>
        </el-table-column>
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
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="书名" prop="title">
          <el-input v-model="form.title" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="form.isbn" placeholder="请输入ISBN" />
        </el-form-item>
        <el-form-item label="出版社" prop="publisher">
          <el-input v-model="form.publisher" placeholder="请输入出版社" />
        </el-form-item>
        <el-form-item label="出版日期" prop="publishDate">
          <el-date-picker
            v-model="form.publishDate"
            type="date"
            placeholder="请选择出版日期"
            style="width: 100%;"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%;">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
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
import { useBookStore } from '@/stores/books'
import { useCategoryStore } from '@/stores/categories'
import { Book } from '@/api'

const bookStore = useBookStore()
const categoryStore = useCategoryStore()

const books = computed(() => bookStore.books)
const loading = computed(() => bookStore.loading)
const total = computed(() => bookStore.total)
const currentPage = computed(() => bookStore.currentPage)
const pageSize = computed(() => bookStore.pageSize)
const categories = computed(() => categoryStore.categories)

const searchForm = reactive({
  title: '',
  author: '',
  categoryId: undefined as number | undefined | null
})

const dialogVisible = ref(false)
const dialogTitle = ref('添加图书')
const formRef = ref<FormInstance>()
const form = reactive<Book>({
  title: '',
  author: '',
  isbn: '',
  publisher: '',
  publishDate: '',
  stock: 0,
  categoryId: 0
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  isbn: [{ required: true, message: '请输入ISBN', trigger: 'blur' }],
  publisher: [{ required: true, message: '请输入出版社', trigger: 'blur' }],
  publishDate: [{ required: true, message: '请选择出版日期', trigger: 'change' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

const parentCategories = computed(() => {
  return categories.value.filter(c => !c.parentId)
})

const getChildCategories = (parentId: number | undefined) => {
  if (!parentId) return []
  return categories.value.filter(c => c.parentId === parentId)
}

const getCategoryName = (categoryId: number) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : ''
}

const handleSearch = () => {
  bookStore.fetchBooks({
    page: 1,
    size: pageSize.value,
    title: searchForm.title || undefined,
    author: searchForm.author || undefined,
    categoryId: searchForm.categoryId
  })
}

const handleReset = () => {
  searchForm.title = ''
  searchForm.author = ''
  searchForm.categoryId = undefined
  bookStore.clear()
  bookStore.fetchBooks({
    page: 1,
    size: pageSize.value
  })
}

const handleAdd = () => {
  dialogTitle.value = '添加图书'
  dialogVisible.value = true
  resetForm()
}

const handleEdit = (row: Book) => {
  dialogTitle.value = '编辑图书'
  dialogVisible.value = true
  Object.assign(form, row)
}

const handleDelete = async (row: Book) => {
  try {
    await ElMessageBox.confirm('确定要删除该图书吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await bookStore.deleteBook(row.id!)
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
        await bookStore.updateBook(form.id, form)
      } else {
        await bookStore.createBook(form)
      }
      dialogVisible.value = false
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(form, {
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publishDate: '',
    stock: 0,
    categoryId: 0
  })
}

const handleSizeChange = (val: number) => {
  bookStore.fetchBooks({
    page: 1,
    size: val,
    title: searchForm.title || undefined,
    author: searchForm.author || undefined,
    categoryId: searchForm.categoryId
  })
}

const handleCurrentChange = (val: number) => {
  bookStore.fetchBooks({
    page: val,
    size: pageSize.value,
    title: searchForm.title || undefined,
    author: searchForm.author || undefined,
    categoryId: searchForm.categoryId
  })
}

onMounted(async () => {
  await categoryStore.fetchCategories()
  bookStore.fetchBooks()
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