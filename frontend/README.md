# 图书管理系统前端

这是一个基于 Vue 3 + TypeScript + Element Plus 的图书管理系统前端项目。

## 技术栈

- Vue 3.x
- TypeScript
- Vite
- Element Plus
- Pinia
- Vue Router
- Axios
- ECharts

## 项目结构

```
frontend/
├── src/
│   ├── api/           # API 接口
│   ├── components/    # 公共组件
│   ├── layout/        # 布局组件
│   ├── router/        # 路由配置
│   ├── stores/        # 状态管理
│   ├── styles/        # 全局样式
│   ├── views/         # 页面组件
│   ├── App.vue        # 根组件
│   └── main.ts        # 入口文件
├── index.html         # HTML 模板
├── package.json       # 项目依赖
├── tsconfig.json      # TypeScript 配置
└── vite.config.ts     # Vite 配置
```

## 安装依赖

```bash
npm install
```

## 开发模式

```bash
npm run dev
```

## 生产构建

```bash
npm run build
```

## 预览构建

```bash
npm run preview
```

## 功能特性

- 首页仪表板：统计数据展示、图表可视化
- 图书管理：图书列表、添加、编辑、删除、搜索、分页
- 分类管理：分类列表、添加、编辑、删除
- 用户管理：用户列表、添加、编辑、删除、角色管理
- 响应式设计：适配桌面端、平板端、移动端
- 统一错误处理和加载状态

## API 配置

API 基础路径配置在 `src/api/request.ts` 中，默认为 `/api`，通过 Vite 代理转发到后端服务。

## 开发说明

- 前端开发服务器运行在 `http://localhost:3000`
- 后端 API 代理到 `http://localhost:8080`
- 确保后端服务已启动并运行在 8080 端口