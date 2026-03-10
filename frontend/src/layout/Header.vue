<template>
  <div class="header">
    <div class="logo">
      <h2>图书管理系统</h2>
    </div>
    <el-menu
      mode="horizontal"
      :default-active="activeMenu"
      router
      class="header-menu"
    >
      <el-menu-item index="/dashboard">首页</el-menu-item>
      <el-menu-item index="/books">图书管理</el-menu-item>
      <el-menu-item index="/categories">分类管理</el-menu-item>
      <el-menu-item index="/users">用户管理</el-menu-item>
    </el-menu>
    <div class="user-info">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-icon><User /></el-icon>
          管理员
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { User, ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 100%;
}

.logo h2 {
  color: var(--primary-color);
  margin: 0;
  font-size: 1.25rem;
}

.header-menu {
  flex: 1;
  margin: 0 40px;
  border-bottom: none;
}

.user-info {
  cursor: pointer;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  gap: 5px;
}

@media (max-width: 768px) {
  .header-menu {
    display: none;
  }

  .logo h2 {
    font-size: 1rem;
  }
}
</style>