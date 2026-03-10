# 前端服务启动指南

## 问题诊断

错误信息：`'npm' 不是内部或外部命令`

**原因**：系统没有安装 Node.js 或 Node.js 没有正确配置到环境变量中。

## 解决方案

### 方案一：安装 Node.js（推荐）

#### 1. 下载 Node.js
- 官网：https://nodejs.org/
- 下载 LTS 版本（推荐 18.x 或 20.x）

#### 2. 安装 Node.js
- 运行安装程序
- ✅ 勾选 "Add to PATH" 选项
- ✅ 使用默认安装路径

#### 3. 验证安装
安装完成后，**关闭所有终端窗口**，打开新的终端运行：

```powershell
node --version
npm --version
```

如果能看到版本号，说明安装成功。

#### 4. 启动前端服务

```powershell
# 进入前端目录
cd d:\zlw_code\trae\frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 方案二：使用在线开发环境

如果不想在本地安装 Node.js，可以使用：

#### StackBlitz
- 访问：https://stackblitz.com/
- 创建新的 Vue 项目
- 复制前端代码到在线编辑器
- 直接在浏览器中运行

#### CodeSandbox
- 访问：https://codesandbox.io/
- 创建新的 Vue + TypeScript 项目
- 复制前端代码到在线编辑器
- 直接在浏览器中运行

### 方案三：使用 Docker

如果你有 Docker，可以运行：

```bash
# 使用官方 Node.js 镜像
docker run -it --rm -v d:\zlw_code\trae\frontend:/app -w /app -p 3000:3000 node:18 bash

# 在容器内运行
npm install
npm run dev
```

## 常见问题

### Q: 安装后仍然提示找不到 npm 命令？
A: 需要重启终端或重启电脑，让环境变量生效。

### Q: 如何检查 Node.js 是否已安装？
A: 运行 `node --version`，如果显示版本号说明已安装。

### Q: 可以使用其他包管理器吗？
A: 可以，推荐使用 pnpm 或 yarn：
```powershell
# 使用 pnpm
npm install -g pnpm
pnpm install
pnpm dev

# 使用 yarn
npm install -g yarn
yarn install
yarn dev
```

## 完整启动流程

### 1. 安装 Node.js
- 下载并安装 Node.js LTS 版本
- 重启终端

### 2. 安装依赖
```powershell
cd d:\zlw_code\trae\frontend
npm install
```

### 3. 启动前端
```powershell
npm run dev
```

### 4. 访问应用
- 打开浏览器访问：http://localhost:3000

## 系统要求

- **操作系统**: Windows 10/11
- **Node.js**: 16.x 或更高版本
- **内存**: 至少 4GB RAM
- **磁盘空间**: 至少 1GB 可用空间

## 推荐工具

- **IDE**: VS Code + Volar 插件
- **终端**: Windows Terminal 或 PowerShell
- **浏览器**: Chrome、Firefox、Safari、Edge 最新版

## 技术支持

如果遇到问题，可以：
1. 查看 Node.js 官方文档：https://nodejs.org/docs/
2. 查看 npm 官方文档：https://docs.npmjs.com/
3. 搜索相关问题：https://stackoverflow.com/