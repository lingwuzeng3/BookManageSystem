import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { bookApi, Book, PageResult } from '@/api'
import { ElMessage } from 'element-plus'

// 缓存配置
const CACHE_EXPIRY_TIME = 5 * 60 * 1000 // 5分钟缓存

export const useBookStore = defineStore('books', () => {
  const books = ref<Book[]>([])
  const loading = ref(false)
  const total = ref(0)
  const cacheTime = ref<number>(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  // 计算属性：检查缓存是否过期
  const isCacheExpired = computed(() => {
    return Date.now() - cacheTime.value > CACHE_EXPIRY_TIME
  })

  // 获取图书列表（带缓存）
  const fetchBooks = async (params?: any) => {
    const newPage = params?.page || currentPage.value
    const newSize = params?.size || pageSize.value
    const newTitle = params?.title
    const newAuthor = params?.author
    const newCategoryId = params?.categoryId

    // 检查是否需要刷新缓存（筛选条件改变时必须刷新）
    const needRefresh = newPage !== currentPage.value ||
      newSize !== pageSize.value ||
      newTitle !== undefined ||
      newAuthor !== undefined ||
      newCategoryId !== undefined ||
      isCacheExpired.value

    if (!needRefresh && books.value.length > 0) {
      console.log('使用缓存数据')
      return
    }

    loading.value = true
    try {
      const response = await bookApi.getPage({
        page: newPage,
        size: newSize,
        title: newTitle,
        author: newAuthor,
        categoryId: newCategoryId
      })

      console.log('后端返回的分页数据:', response)

      books.value = response.records || []
      total.value = response.total || 0
      currentPage.value = response.pageNum || 1
      pageSize.value = response.pageSize || 10
      cacheTime.value = Date.now()

      console.log('图书数据加载成功:', books.value.length, '条')
    } catch (error) {
      console.error('获取图书列表失败:', error)
      ElMessage.error('获取图书列表失败，请稍后重试')
      throw error
    } finally {
      loading.value = false
    }
  }

  // 创建图书
  const createBook = async (data: Book) => {
    loading.value = true
    try {
      const success = await bookApi.create(data)
      if (success) {
        ElMessage.success('图书添加成功')
        // 清除缓存，强制刷新
        cacheTime.value = 0
        await fetchBooks()
      }
      return success
    } catch (error) {
      console.error('创建图书失败:', error)
      ElMessage.error('添加图书失败，请稍后重试')
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新图书
  const updateBook = async (id: number, data: Book) => {
    loading.value = true
    try {
      const success = await bookApi.update(id, data)
      if (success) {
        ElMessage.success('图书更新成功')
        // 更新本地缓存
        const index = books.value.findIndex(b => b.id === id)
        if (index !== -1) {
          books.value[index] = { ...data, id }
        }
        // 清除缓存，强制刷新
        cacheTime.value = 0
      }
      return success
    } catch (error) {
      console.error('更新图书失败:', error)
      ElMessage.error('更新图书失败，请稍后重试')
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除图书
  const deleteBook = async (id: number) => {
    loading.value = true
    try {
      const success = await bookApi.delete(id)
      if (success) {
        ElMessage.success('图书删除成功')
        // 从本地缓存中移除
        books.value = books.value.filter(b => b.id !== id)
        total.value = Math.max(0, total.value - 1)
      }
      return success
    } catch (error) {
      console.error('删除图书失败:', error)
      ElMessage.error('删除图书失败，请稍后重试')
      throw error
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  const refresh = () => {
    cacheTime.value = 0
    return fetchBooks()
  }

  // 清空数据
  const clear = () => {
    books.value = []
    total.value = 0
    cacheTime.value = 0
  }

  return {
    books,
    loading,
    total,
    currentPage,
    pageSize,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    refresh,
    clear
  }
})