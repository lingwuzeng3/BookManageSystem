package com.example.library.controller;

import com.example.library.entity.Category;
import com.example.library.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> list() {
        return categoryService.findAll();
    }

    @GetMapping("/{id}")
    public Category getById(@PathVariable Integer id) {
        return categoryService.findById(id);
    }

    @PostMapping
    public boolean save(@RequestBody Category category) {
        return categoryService.insert(category);
    }

    @PutMapping("/{id}")
    public boolean update(@PathVariable Integer id, @RequestBody Category category) {
        category.setId(id);
        return categoryService.update(category);
    }

    @DeleteMapping("/{id}")
    public boolean removeById(@PathVariable Integer id) {
        return categoryService.deleteById(id);
    }
}