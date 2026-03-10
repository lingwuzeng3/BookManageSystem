import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { categoryApi, Category } from '@/api'
import { ElMessage } from 'element-plus'

// 缓存配置
const CACHE_EXPIRY_TIME = 10 * 60 * 1000 // 10分钟缓存

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const cacheTime = ref<number>(0)

  // 计算属性：检查缓存是否过期
  const isCacheExpired = computed(() => {
    return Date.now() - cacheTime.value > CACHE_EXPIRY_TIME
  })

  // 获取分类列表（带缓存）
  const fetchCategories = async () => {
    // 检查是否需要刷新缓存
    if (!isCacheExpired.value && categories.value.length > 0) {
      console.log('使用分类缓存数据')
      return
    }

    loading.value = true
    try {
      const response = await categoryApi.getList()
      categories.value = response || []
      cacheTime.value = Date.now()
      console.log('分类数据加载成功:', categories.value.length, '条')
    } catch (error) {
      console.error('获取分类列表失败:', error)
      ElMessage.error('获取分类列表失败，请稍后重试')
      throw error
    } finally {
      loading.value = false
    }
  }

  // 创建分类
  const createCategory = async (data: Category) => {
    loading.value = true
    try {
      const success = await categoryApi.create(data)
      if (success) {
        ElMessage.success('分类添加成功')
        // 清除缓存，强制刷新
        cacheTime.value = 0
        await fetchCategories()
      }
      return success
    } catch (error) {
      console.error('创建分类失败:', error)
      ElMessage.error('添加分类失败，请稍后重试')
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新分类
  const updateCategory = async (data: Category) => {
    loading.value = true
    try {
      const success = await categoryApi.update(data)
      if (success) {
        ElMessage.success('分类更新成功')
        // 更新本地缓存
        const index = categories.value.findIndex(c => c.id === data.id)
        if (index !== -1) {
          categories.value[index] = data
        }
        // 清除缓存，强制刷新
        cacheTime.value = 0
      }
      return success
    } catch (error) {
      console.error('更新分类失败:', error)
      ElMessage.error('更新分类失败，请稍后重试')
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除分类
  const deleteCategory = async (id: number) => {
    loading.value = true
    try {
      const success = await categoryApi.delete(id)
      if (success) {
        ElMessage.success('分类删除成功')
        // 从本地缓存中移除
        categories.value = categories.value.filter(c => c.id !== id)
      }
      return success
    } catch (error) {
      console.error('删除分类失败:', error)
      ElMessage.error('删除分类失败，请稍后重试')
      throw error
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  const refresh = () => {
    cacheTime.value = 0
    return fetchCategories()
  }

  // 清空数据
  const clear = () => {
    categories.value = []
    cacheTime.value = 0
  }

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    refresh,
    clear
  }
})