package com.example.library.controller;

import com.example.library.common.PageResult;
import com.example.library.entity.Book;
import com.example.library.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    private BookService bookService;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.findAll();
    }

    @GetMapping("/page")
    public PageResult<Book> getBooksByPage(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) Integer categoryId) {
        return bookService.findByPage(title, author, categoryId, page, size);
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable Long id) {
        return bookService.findById(id);
    }

    @PostMapping
    public boolean addBook(@RequestBody Book book) {
        return bookService.insert(book);
    }

    @PutMapping("/{id}")
    public boolean updateBook(@PathVariable Long id, @RequestBody Book book) {
        book.setId(id);
        return bookService.update(book);
    }

    @DeleteMapping("/{id}")
    public boolean deleteBook(@PathVariable Long id) {
        return bookService.deleteById(id);
    }
}