import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, LoginRequest, LoginResponse } from '@/api'
import { ElMessage } from 'element-plus'

const TOKEN_KEY = 'library_token'
const USER_KEY = 'library_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>('')
  const user = ref<LoginResponse | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const loadFromStorage = () => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_KEY)

    if (savedToken) {
      token.value = savedToken
    }

    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
  }

  const saveToStorage = () => {
    if (token.value) {
      localStorage.setItem(TOKEN_KEY, token.value)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }

    if (user.value) {
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  }

  const login = async (username: string, password: string) => {
    const response = await authApi.login({ username, password })

    if (typeof response === 'string') {
      throw new Error(response)
    }

    token.value = response.token
    user.value = response
    saveToStorage()

    return response
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('退出登录请求失败:', error)
    } finally {
      token.value = ''
      user.value = null
      saveToStorage()
      ElMessage.success('退出成功')
    }
  }

  const clear = () => {
    token.value = ''
    user.value = null
    saveToStorage()
  }

  loadFromStorage()

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    clear
  }
})
