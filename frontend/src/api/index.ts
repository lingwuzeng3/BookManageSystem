import request from './request'

export interface Book {
  id?: number
  title: string
  author: string
  isbn: string
  publisher: string
  publishDate: string
  stock: number
  categoryId: number
}

export interface Category {
  id?: number
  name: string
  description?: string
  parentId?: number
}

export interface User {
  id?: number
  username: string
  password?: string
  role: string
  status: string
  createTime?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userId: number
  username: string
  role: string
}

export interface PageResult<T> {
  records: T[]
  total: number
  pageNum: number
  pageSize: number
  pages: number
}

export const bookApi = {
  // 获取所有图书
  getList: (): Promise<Book[]> => request.get('/books'),

  // 分页获取图书
  getPage: (params: { page: number; size: number; title?: string; author?: string; categoryId?: number }): Promise<PageResult<Book>> =>
    request.get('/books/page', { params }),

  // 根据 ID 获取图书
  getById: (id: number): Promise<Book> => request.get(`/books/${id}`),

  // 添加图书
  create: (data: Book): Promise<boolean> => request.post('/books', data),

  // 更新图书
  update: (id: number, data: Book): Promise<boolean> => request.put(`/books/${id}`, data),

  // 删除图书
  delete: (id: number): Promise<boolean> => request.delete(`/books/${id}`)
}

export const categoryApi = {
  // 获取所有分类
  getList: (): Promise<Category[]> => request.get('/categories'),

  // 分页获取分类
  getPage: (params: { page: number; size: number }): Promise<PageResult<Category>> =>
    request.get('/categories/page', { params }),

  // 根据 ID 获取分类
  getById: (id: number): Promise<Category> => request.get(`/categories/${id}`),

  // 添加分类
  create: (data: Category): Promise<boolean> => request.post('/categories', data),

  // 更新分类
  update: (data: Category): Promise<boolean> => request.put(`/categories/${data.id}`, data),

  // 删除分类
  delete: (id: number): Promise<boolean> => request.delete(`/categories/${id}`)
}

export const userApi = {
  // 获取所有用户
  getList: (): Promise<User[]> => request.get('/users'),

  // 分页获取用户
  getPage: (params: { page: number; size: number; username?: string; role?: string; status?: string }): Promise<PageResult<User>> =>
    request.get('/users/page', { params }),

  // 根据 ID 获取用户
  getById: (id: number): Promise<User> => request.get(`/users/${id}`),

  // 添加用户
  create: (data: User): Promise<boolean> => request.post('/users', data),

  // 更新用户
  update: (data: User): Promise<boolean> => request.put(`/users/${data.id}`, data),

  // 删除用户
  delete: (id: number): Promise<boolean> => request.delete(`/users/${id}`)
}

export const authApi = {
  // 登录
  login: (data: LoginRequest): Promise<LoginResponse> => request.post('/auth/login', data),

  // 退出登录
  logout: (): Promise<string> => request.post('/auth/logout')
}