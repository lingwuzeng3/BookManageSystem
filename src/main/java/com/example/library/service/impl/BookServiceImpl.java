package com.example.library.service.impl;

import com.example.library.entity.Book;
import com.example.library.mapper.BookMapper;
import com.example.library.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookMapper bookMapper;

    @Override
    public List<Book> findAll() {
        return bookMapper.findAll();
    }

    @Override
    public Book findById(Long id) {
        return bookMapper.findById(id);
    }

    @Override
    public boolean insert(Book book) {
        return bookMapper.insert(book) > 0;
    }

    @Override
    public boolean update(Book book) {
        return bookMapper.update(book) > 0;
    }

    @Override
    public boolean deleteById(Long id) {
        return bookMapper.deleteById(id) > 0;
    }

    @Override
    public com.example.library.common.PageResult<Book> findByPage(String title, String author, Integer categoryId,
            int pageNum, int pageSize) {
        int offset = (pageNum - 1) * pageSize;
        List<Book> list = bookMapper.findByPage(title, author, categoryId, offset, pageSize);
        int total = bookMapper.countByPage(title, author, categoryId);
        return new com.example.library.common.PageResult<>(list, total, pageNum, pageSize);
    }
}