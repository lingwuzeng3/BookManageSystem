import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi, User, PageResult } from '@/api'
import { ElMessage } from 'element-plus'

// 缓存配置
const CACHE_EXPIRY_TIME = 5 * 60 * 1000 // 5分钟缓存

export const useUserStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const total = ref(0)
  const cacheTime = ref<number>(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  // 计算属性：检查缓存是否过期
  const isCacheExpired = computed(() => {
    return Date.now() - cacheTime.value > CACHE_EXPIRY_TIME
  })

  // 获取用户列表（带缓存）
  const fetchUsers = async (params?: any) => {
    const newPage = params?.page || currentPage.value
    const newSize = params?.size || pageSize.value
    const newUsername = params?.username
    const newRole = params?.role
    const newStatus = params?.status

    // 检查是否需要刷新缓存（筛选条件改变时必须刷新）
    const needRefresh = newPage !== currentPage.value ||
      newSize !== pageSize.value ||
      newUsername !== undefined ||
      newRole !== undefined ||
      newStatus !== undefined ||
      isCacheExpired.value

    if (!needRefresh && users.value.length > 0) {
      console.log('使用用户缓存数据')
      return
    }

    loading.value = true
    try {
      const response = await userApi.getPage({
        page: newPage,
        size: newSize,
        username: newUsername,
        role: newRole,
        status: newStatus
      })

      console.log('后端返回的用户分页数据:', response)

      users.value = response.records || []
      total.value = response.total || 0
      currentPage.value = response.pageNum || 1
      pageSize.value = response.pageSize || 10
      cacheTime.value = Date.now()

      console.log('用户数据加载成功:', users.value.length, '条')
    } catch (error) {
      console.error('获取用户列表失败:', error)
      ElMessage.error('获取用户列表失败，请稍后重试')
      throw error
    } finally {
      loading.value = false
    }
  }

  // 创建用户
  const createUser = async (data: User) => {
    loading.value = true
    try {
      const success = await userApi.create(data)
      if (success) {
        ElMessage.success('用户添加成功')
        // 清除缓存，强制刷新
        cacheTime.value = 0
        await fetchUsers()
      }
      return success
    } catch (error) {
      console.error('创建用户失败:', error)
      ElMessage.error('添加用户失败，请稍后重试')
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新用户
  const updateUser = async (data: User) => {
    loading.value = true
    try {
      const success = await userApi.update(data)
      if (success) {
        ElMessage.success('用户更新成功')
        // 更新本地缓存
        const index = users.value.findIndex(u => u.id === data.id)
        if (index !== -1) {
          users.value[index] = data
        }
        // 清除缓存，强制刷新
        cacheTime.value = 0
      }
      return success
    } catch (error) {
      console.error('更新用户失败:', error)
      ElMessage.error('更新用户失败，请稍后重试')
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除用户
  const deleteUser = async (id: number) => {
    loading.value = true
    try {
      const success = await userApi.delete(id)
      if (success) {
        ElMessage.success('用户删除成功')
        // 从本地缓存中移除
        users.value = users.value.filter(u => u.id !== id)
        total.value = Math.max(0, total.value - 1)
      }
      return success
    } catch (error) {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败，请稍后重试')
      throw error
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  const refresh = () => {
    cacheTime.value = 0
    return fetchUsers()
  }

  // 清空数据
  const clear = () => {
    users.value = []
    total.value = 0
    cacheTime.value = 0
  }

  return {
    users,
    loading,
    total,
    currentPage,
    pageSize,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    refresh,
    clear
  }
})