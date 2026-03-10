# MyBatis重构总结

## 重构完成情况

项目已从MyBatis Plus重构为原生MyBatis + PageHelper，所有功能已完成。

## 后端改动

### 1. 依赖管理
**文件**: `pom.xml`

- 移除：`mybatis-plus-boot-starter`
- 添加：
  - `mybatis-spring-boot-starter` (2.3.1)
  - `pagehelper-spring-boot-starter` (1.4.7)

### 2. 配置类
- 删除：`MyBatisPlusConfig.java`
- PageHelper自动配置，无需额外配置

### 3. 实体类
移除所有MyBatis Plus注解：
- `@TableName`
- `@TableId`
- `@IdType`

**修改文件**：
- `Book.java`
- `User.java`
- `Category.java`

### 4. Mapper接口
**修改文件**：
- `BookMapper.java` - 添加分页查询方法
- `UserMapper.java` - 添加分页查询方法
- `CategoryMapper.java` - 基础CRUD方法

### 5. Mapper XML
**新建文件**：
- `BookMapper.xml` - 包含分页和筛选SQL
- `UserMapper.xml` - 包含分页和筛选SQL
- `CategoryMapper.xml` - 基础CRUD SQL

### 6. Service层
**修改接口**：
- `BookService.java` - 添加分页方法
- `UserService.java` - 添加分页方法
- `CategoryService.java` - 基础CRUD方法

**修改实现**：
- `BookServiceImpl.java` - 使用PageHelper实现分页
- `UserServiceImpl.java` - 使用PageHelper实现分页
- `CategoryServiceImpl.java` - 基础CRUD实现

### 7. Controller层
**修改文件**：
- `BookController.java` - 返回自定义PageResult
- `UserController.java` - 返回自定义PageResult
- `CategoryController.java` - 修复PUT方法路径

### 8. 通用类
**新建文件**：
- `PageResult.java` - 自定义分页结果类
  - `records`: 数据列表
  - `total`: 总记录数
  - `pageNum`: 当前页码
  - `pageSize`: 每页大小
  - `pages`: 总页数

## 前端改动

### 1. API接口定义
**文件**: `frontend/src/api/index.ts`

修改`PageResult`接口：
```typescript
export interface PageResult<T> {
  records: T[]
  total: number
  pageNum: number      // 从 current 改为 pageNum
  pageSize: number     // 从 size 改为 pageSize
  pages: number
}
```

### 2. Store状态管理
**修改文件**：
- `frontend/src/stores/books.ts`
- `frontend/src/stores/users.ts`

修改分页数据解析：
```typescript
currentPage.value = response.pageNum || 1
pageSize.value = response.pageSize || 10
```

## 功能特性

### 分页功能
- 使用PageHelper实现物理分页
- 支持动态筛选条件
- 自动计算总页数

### 筛选功能
- **图书**: title、author、categoryId
- **用户**: username、role、status
- 使用MyBatis动态SQL

### CRUD功能
- 完整的增删改查
- 自动设置创建和更新时间
- 支持主键自增

## 启动测试

### 1. 后端启动
```bash
cd d:\zlw_code\trae
mvn clean install
mvn spring-boot:run
```

### 2. 前端启动
```bash
cd d:\zlw_code\trae\frontend
npm run dev
```

### 3. 功能测试

#### 图书管理
- ✅ 分页查询
- ✅ 按书名筛选
- ✅ 按作者筛选
- ✅ 按分类筛选
- ✅ 添加图书
- ✅ 编辑图书
- ✅ 删除图书

#### 用户管理
- ✅ 分页查询
- ✅ 按用户名筛选
- ✅ 按角色筛选
- ✅ 按状态筛选
- ✅ 添加用户
- ✅ 编辑用户
- ✅ 删除用户

#### 分类管理
- ✅ 查询所有分类
- ✅ 添加分类
- ✅ 编辑分类（包含描述）
- ✅ 删除分类

## 技术栈对比

### MyBatis Plus
- 自动CRUD
- 自动分页
- 注解驱动
- 代码简洁

### 原生MyBatis
- 手写SQL
- 完全控制
- 灵活性高
- 性能优化空间大

## 注意事项

1. **数据库字段映射**
   - Java驼峰命名 -> 数据库下划线命名
   - 如：`categoryId` -> `category_id`

2. **PageHelper使用**
   - 在Service层调用`PageHelper.startPage()`
   - 自动拦截SQL并添加分页

3. **时间字段**
   - 使用`NOW()`函数自动设置时间
   - 无需在Java中处理

4. **空值处理**
   - 前端传递空字符串时，后端需要判断
   - 使用`<if test="...">`动态SQL

## 优势

1. **完全控制SQL**
   - 可以精确优化查询
   - 适合复杂业务场景

2. **学习成本低**
   - 标准MyBatis语法
   - 社区资源丰富

3. **性能优化**
   - 可以针对特定查询优化
   - 减少不必要的字段查询

4. **可维护性**
   - SQL与代码分离
   - 便于DBA审核和优化