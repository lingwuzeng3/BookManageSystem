package com.example.library.service;

import com.example.library.entity.User;
import com.example.library.common.PageResult;

import java.util.List;

public interface UserService {
  List<User> findAll();

  User findById(Long id);

  boolean insert(User user);

  boolean update(User user);

  boolean deleteById(Long id);

  PageResult<User> findByPage(String username, String role, String status, int pageNum, int pageSize);
}