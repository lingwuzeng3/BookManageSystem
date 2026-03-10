package com.example.library.mapper;

import com.example.library.entity.Book;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BookMapper {
    List<Book> findAll();

    Book findById(Long id);

    int insert(Book book);

    int update(Book book);

    int deleteById(Long id);

    List<Book> findByPage(String title, String author, Integer categoryId, int offset, int pageSize);

    int countByPage(String title, String author, Integer categoryId);
}