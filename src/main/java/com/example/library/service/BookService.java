package com.example.library.service;

import com.example.library.entity.Book;
import com.example.library.common.PageResult;

import java.util.List;

public interface BookService {
    List<Book> findAll();
    
    Book findById(Long id);
    
    boolean insert(Book book);
    
    boolean update(Book book);
    
    boolean deleteById(Long id);
    
    PageResult<Book> findByPage(String title, String author, Integer categoryId, int pageNum, int pageSize);
}