# 前端访问路径说明

## 项目结构

```
d:\zlw_code\trae\
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── api/           # API 接口
│   │   ├── layout/        # 布局组件
│   │   ├── router/        # 路由配置
│   │   ├── stores/        # 状态管理
│   │   ├── styles/        # 全局样式
│   │   ├── views/         # 页面组件
│   │   ├── App.vue        # 根组件
│   │   └── main.ts       # 入口文件
│   ├── index.html         # HTML 模板
│   ├── package.json       # 项目依赖
│   └── vite.config.ts     # Vite 配置
└── src/                 # 后端项目
```

## 启动前端

### 1. 进入前端目录
```bash
cd d:\zlw_code\trae\frontend
```

### 2. 安装依赖（如果尚未安装）
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

## 访问路径

### 开发环境
- **URL**: `http://localhost:3000`
- **端口**: 3000
- **状态**: 开发服务器运行在前端目录

### 页面路由

前端使用 Vue Router 进行页面路由，所有页面都在同一个应用内：

| 路径 | 页面名称 | 说明 |
|------|---------|------|
| `/` | 首页 | 自动重定向到 `/dashboard` |
| `/dashboard` | 首页仪表板 | 显示统计数据和图表 |
| `/books` | 图书管理 | 图书列表、添加、编辑、删除 |
| `/categories` | 分类管理 | 分类列表、添加、编辑、删除 |
| `/users` | 用户管理 | 用户列表、添加、编辑、删除 |

### API 代理配置

前端通过 Vite 代理将 `/api` 请求转发到后端：

- **前端 API 路径**: `/api/*`
- **代理目标**: `http://localhost:8080`
- **配置文件**: `vite.config.ts`

### API 端点映射

| 前端请求 | 后端接口 | 说明 |
|----------|----------|------|
| `/api/books` | `http://localhost:8080/books` | 获取图书列表 |
| `/api/books/page` | `http://localhost:8080/books/page` | 分页获取图书 |
| `/api/books/:id` | `http://localhost:8080/books/:id` | 获取单个图书 |
| `/api/categories` | `http://localhost:8080/categories` | 获取分类列表 |
| `/api/categories/:id` | `http://localhost:8080/categories/:id` | 获取单个分类 |
| `/api/users` | `http://localhost:8080/users` | 获取用户列表 |
| `/api/users/:id` | `http://localhost:8080/users/:id` | 获取单个用户 |

## 启动后端

### 1. 进入后端目录
```bash
cd d:\zlw_code\trae
```

### 2. 启动 Spring Boot 应用
```bash
mvn spring-boot:run
```

### 后端访问
- **URL**: `http://localhost:8080`
- **端口**: 8080

## 完整启动流程

### 1. 启动后端服务
```bash
# 在项目根目录
cd d:\zlw_code\trae
mvn spring-boot:run
```

### 2. 启动前端服务（新终端）
```bash
# 在新终端中
cd d:\zlw_code\trae\frontend
npm run dev
```

### 3. 访问应用
打开浏览器访问：`http://localhost:3000`

## 功能说明

### 首页仪表板 (`/dashboard`)
- 统计卡片：图书总数、分类数量、用户数量、总库存
- 分类统计图表（ECharts 饼图）
- 最近添加的图书列表

### 图书管理 (`/books`)
- 图书列表展示（表格视图）
- 搜索功能：按书名、作者搜索
- 筛选功能：按分类筛选
- 分页控制：支持每页 10/20/50/100 条
- CRUD 操作：添加、编辑、删除图书

### 分类管理 (`/categories`)
- 分类列表展示
- 添加、编辑、删除分类
- 分类描述管理

### 用户管理 (`/users`)
- 用户列表展示
- 搜索功能：按用户名搜索
- 筛选功能：按角色、状态筛选
- 角色管理：管理员/用户
- 状态管理：启用/禁用
- CRUD 操作：添加、编辑、删除用户

## 响应式设计

### 桌面端 (≥1024px)
- 侧边栏固定显示，宽度 250px
- 完整表格显示
- 4列卡片布局

### 平板端 (768px - 1023px)
- 侧边栏宽度 200px
- 2-3列卡片布局

### 移动端 (<768px)
- 侧边栏隐藏
- 顶部导航菜单隐藏
- 单列卡片布局
- 触摸友好的交互元素

## 技术栈

- **框架**: Vue 3.x + TypeScript
- **构建工具**: Vite
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios（模拟版本）
- **图表**: ECharts
- **日期处理**: Day.js

## 注意事项

1. **依赖安装**: 确保 `node_modules` 文件夹存在，如果不存在请运行 `npm install`
2. **端口占用**: 确保 3000 端口未被占用，如果被占用可以修改 `vite.config.ts` 中的端口配置
3. **后端服务**: 确保后端服务运行在 8080 端口，否则 API 请求会失败
4. **浏览器兼容**: 建议使用最新版本的 Chrome、Firefox、Safari 或 Edge
5. **开发工具**: 推荐使用 VS Code + Volar 插件进行开发

## 故障排除

### 前端无法启动
1. 检查 Node.js 版本：`node -v`（建议 16.x 或更高）
2. 删除 `node_modules` 文件夹，重新运行 `npm install`
3. 清理 npm 缓存：`npm cache clean --force`

### API 请求失败
1. 检查后端服务是否启动：访问 `http://localhost:8080`
2. 检查浏览器控制台的网络请求
3. 检查 `vite.config.ts` 中的代理配置

### 页面显示异常
1. 检查浏览器控制台是否有错误
2. 清除浏览器缓存
3. 尝试使用无痕模式访问

## 构建生产版本

```bash
cd d:\zlw_code\trae\frontend
npm run build
```

构建后的文件将生成在 `dist` 文件夹中，可以部署到任何静态文件服务器。