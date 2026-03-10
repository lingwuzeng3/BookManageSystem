package com.example.library.mapper;

import com.example.library.entity.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {
  List<User> findAll();

  User findById(Long id);

  int insert(User user);

  int update(User user);

  int deleteById(Long id);

  List<User> findByPage(String username, String role, String status, int offset, int pageSize);

  int countByPage(String username, String role, String status);
}