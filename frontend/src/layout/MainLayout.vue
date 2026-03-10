<template>
  <div class="main-layout">
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-container>
        <el-aside width="250px">
          <Sidebar />
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import Footer from './Footer.vue'
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid var(--border-color);
  padding: 0;
  height: 60px;
  line-height: 60px;
}

.el-aside {
  background-color: #fff;
  border-right: 1px solid var(--border-color);
  overflow-x: hidden;
}

.el-main {
  background-color: var(--bg-secondary);
  padding: 20px;
}

.el-footer {
  background-color: #fff;
  border-top: 1px solid var(--border-color);
  text-align: center;
  height: 50px;
  line-height: 50px;
  color: var(--text-secondary);
}

@media (max-width: 767px) {
  .el-aside {
    display: none;
  }
}
</style>