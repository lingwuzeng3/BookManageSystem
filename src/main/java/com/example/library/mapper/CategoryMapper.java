package com.example.library.mapper;

import com.example.library.entity.Category;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CategoryMapper {
    List<Category> findAll();

    Category findById(Integer id);

    int insert(Category category);

    int update(Category category);

    int deleteById(Integer id);

    List<Integer> findChildIds(Integer parentId);
}