package com.example.library.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "Hello World!";
    }

    @GetMapping("/api/test")
    public String apiTest() {
        return "API Test!";
    }
}