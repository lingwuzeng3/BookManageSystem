package com.example.library.controller;

import com.example.library.dto.LoginRequest;
import com.example.library.dto.LoginResponse;
import com.example.library.entity.User;
import com.example.library.service.UserService;
import com.example.library.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userService.findByUsername(loginRequest.getUsername());
        
        if (user == null) {
            return ResponseEntity.badRequest().body("用户不存在");
        }

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.badRequest().body("密码错误");
        }

        if (!"ENABLED".equals(user.getStatus())) {
            return ResponseEntity.badRequest().body("账户已被禁用");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getId(), user.getRole());
        
        LoginResponse response = new LoginResponse(token, user.getId(), user.getUsername(), user.getRole());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("退出成功");
    }
}
