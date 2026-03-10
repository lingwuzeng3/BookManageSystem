# 前后端功能测试指南

## 修复内容总结

### 1. 后端修复

#### 1.1 Category实体类添加description字段
- 文件：`src/main/java/com/example/library/entity/Category.java`
- 添加了`description`字段及其getter/setter方法

#### 1.2 添加MyBatis Plus分页配置
- 文件：`src/main/java/com/example/library/config/MyBatisPlusConfig.java`
- 配置了MySQL分页插件

#### 1.3 Controller筛选参数支持
- **BookController**: 添加了title、author、categoryId筛选参数
- **UserController**: 添加了username、role、status筛选参数
- **CategoryController**: 修复了PUT方法，添加了路径参数{id}

### 2. 前端修复

#### 2.1 API定义修复
- 文件：`frontend/src/api/index.ts`
- 修复了categoryApi.update和userApi.update的URL路径

#### 2.2 Store优化
- 文件：`frontend/src/stores/books.ts`、`frontend/src/stores/users.ts`
- 优化了缓存逻辑，筛选条件改变时强制刷新
- 添加了调试日志

#### 2.3 视图组件修复
- 文件：`frontend/src/views/Books.vue`、`frontend/src/views/Users.vue`
- 修复了搜索、重置、分页功能

## 测试步骤

### 1. 启动后端服务

```bash
cd d:\zlw_code\trae
mvn spring-boot:run
```

等待看到类似以下日志表示启动成功：
```
Started LibraryApplication in X.XXX seconds
```

### 2. 启动前端服务

```bash
cd d:\zlw_code\trae\frontend
npm run dev
```

等待看到类似以下日志表示启动成功：
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### 3. 测试功能

#### 3.1 图书管理测试

**分页测试：**
1. 访问 http://localhost:3000/books
2. 检查表格是否显示数据
3. 点击分页器的下一页，检查是否正确翻页
4. 修改每页显示条数，检查是否正确更新

**筛选测试：**
1. 在书名输入框输入关键词，点击搜索
2. 检查是否只显示匹配的图书
3. 在作者输入框输入关键词，点击搜索
4. 选择分类，点击搜索
5. 点击重置按钮，检查是否清空筛选条件

**CRUD测试：**
1. 点击"添加图书"按钮
2. 填写表单并提交，检查是否成功添加
3. 点击某行的"编辑"按钮
4. 修改数据并提交，检查是否成功更新
5. 点击某行的"删除"按钮
6. 确认删除，检查是否成功删除

#### 3.2 分类管理测试

**CRUD测试：**
1. 访问 http://localhost:3000/categories
2. 点击"添加分类"按钮
3. 填写分类名称和描述，提交
4. 检查描述是否正确保存
5. 点击"编辑"按钮，修改描述
6. 检查修改后的描述是否正确显示

#### 3.3 用户管理测试

**分页测试：**
1. 访问 http://localhost:3000/users
2. 检查表格是否显示数据
3. 点击分页器的下一页，检查是否正确翻页

**筛选测试：**
1. 在用户名输入框输入关键词，点击搜索
2. 选择角色（管理员/用户），点击搜索
3. 选择状态（启用/禁用），点击搜索
4. 点击重置按钮，检查是否清空筛选条件

**CRUD测试：**
1. 点击"添加用户"按钮
2. 填写用户信息并提交，检查是否成功添加
3. 点击某行的"编辑"按钮
4. 修改数据并提交，检查是否成功更新
5. 点击某行的"删除"按钮
6. 确认删除，检查是否成功删除

## 调试信息

### 查看浏览器控制台

1. 按F12打开开发者工具
2. 切换到"Console"标签
3. 查看以下调试信息：
   - `后端返回的分页数据:` - 查看后端返回的数据格式
   - `图书数据加载成功: X 条` - 查看加载的数据条数
   - `使用缓存数据` - 查看是否使用了缓存

### 查看网络请求

1. 按F12打开开发者工具
2. 切换到"Network"标签
3. 刷新页面或执行操作
4. 查看API请求的详细信息：
   - 请求URL
   - 请求参数
   - 响应数据
   - 状态码

## 常见问题

### 问题1：分页不工作

**可能原因：**
- 后端分页插件未配置
- 前端传递的参数格式不正确

**解决方法：**
1. 检查后端是否添加了MyBatisPlusConfig
2. 查看浏览器控制台的调试信息
3. 查看Network标签中的请求参数

### 问题2：筛选不工作

**可能原因：**
- 后端Controller未添加筛选参数
- 前端传递的参数为空字符串而非undefined

**解决方法：**
1. 检查后端Controller的page方法参数
2. 查看Network标签中的请求参数
3. 确认前端Store中正确处理了空字符串

### 问题3：编辑功能不工作

**可能原因：**
- 后端PUT方法路径不正确
- 前端API调用路径不正确

**解决方法：**
1. 检查后端Controller的PUT方法路径
2. 检查前端API定义的update方法路径
3. 确认路径格式为 `/resource/{id}`

### 问题4：分类描述不能保存

**可能原因：**
- Category实体类缺少description字段
- 数据库表缺少description列

**解决方法：**
1. 检查Category实体类是否有description字段
2. 检查数据库category表是否有description列
3. 如果没有，执行SQL添加列：
   ```sql
   ALTER TABLE category ADD COLUMN description VARCHAR(255);
   ```

## 验证修复

完成以上测试后，确认以下功能正常：

- ✅ 图书管理分页功能正常
- ✅ 图书管理筛选功能正常
- ✅ 图书管理CRUD功能正常
- ✅ 用户管理分页功能正常
- ✅ 用户管理筛选功能正常
- ✅ 用户管理CRUD功能正常
- ✅ 分类管理描述保存功能正常
- ✅ 分类管理CRUD功能正常

如果仍有问题，请查看浏览器控制台和Network标签中的详细信息，并提供具体的错误信息。