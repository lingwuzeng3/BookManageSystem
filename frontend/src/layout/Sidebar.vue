<template>
  <el-menu
    :default-active="activeMenu"
    router
    class="sidebar-menu"
  >
    <el-menu-item index="/dashboard">
      <el-icon><Odometer /></el-icon>
      <span>首页</span>
    </el-menu-item>
    <el-menu-item index="/books">
      <el-icon><Reading /></el-icon>
      <span>图书管理</span>
    </el-menu-item>
    <el-menu-item index="/categories">
      <el-icon><Menu /></el-icon>
      <span>分类管理</span>
    </el-menu-item>
    <el-menu-item index="/users">
      <el-icon><User /></el-icon>
      <span>用户管理</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Odometer, Reading, Menu, User } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.sidebar-menu {
  border-right: none;
  height: calc(100vh - 110px);
}

.el-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>