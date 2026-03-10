package com.example.library.service.impl;

import com.example.library.entity.User;
import com.example.library.mapper.UserMapper;
import com.example.library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

  @Autowired
  private UserMapper userMapper;

  @Override
  public List<User> findAll() {
    return userMapper.findAll();
  }

  @Override
  public User findById(Long id) {
    return userMapper.findById(id);
  }

  @Override
  public boolean insert(User user) {
    return userMapper.insert(user) > 0;
  }

  @Override
  public boolean update(User user) {
    return userMapper.update(user) > 0;
  }

  @Override
  public boolean deleteById(Long id) {
    return userMapper.deleteById(id) > 0;
  }

  @Override
  public com.example.library.common.PageResult<User> findByPage(String username, String role, String status,
      int pageNum, int pageSize) {
    int offset = (pageNum - 1) * pageSize;
    List<User> list = userMapper.findByPage(username, role, status, offset, pageSize);

    int total = userMapper.countByPage(username, role, status);

    return new com.example.library.common.PageResult<>(list, total, pageNum, pageSize);
  }
}