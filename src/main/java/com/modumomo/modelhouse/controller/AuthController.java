package com.modumomo.modelhouse.controller;

import com.modumomo.modelhouse.entity.User;
import com.modumomo.modelhouse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;

@Controller
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    // 임시 테스트 사용자 생성 (개발용)
    @GetMapping("/create-test-user")
    @ResponseBody
    public String createTestUser() {
        try {
            // 기존 사용자 삭제
            if (userService.existsByUsername("admin")) {
                return "사용자가 이미 존재합니다.";
            }
            
            // 새 관리자 사용자 생성
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@test.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("테스트 관리자");
            admin.setRole("ROLE_ADMIN");
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            
            userService.saveUser(admin);
            
            return "테스트 사용자 생성 완료!<br>이메일: admin@test.com<br>비밀번호: admin123";
            
        } catch (Exception e) {
            return "오류 발생: " + e.getMessage();
        }
    }
    
    // 기존 사용자 삭제 후 새로 생성 (개발용)
    @GetMapping("/reset-test-user")
    @ResponseBody
    public String resetTestUser() {
        try {
            // 기존 사용자 삭제
            User existingUser = userService.findByUsername("admin");
            if (existingUser != null) {
                // UserRepository에 delete 메서드가 있다면 사용
                // userRepository.delete(existingUser);
                return "기존 사용자를 삭제하려면 UserRepository에 delete 메서드를 추가해야 합니다.";
            }
            
            // 새 관리자 사용자 생성
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@test.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("테스트 관리자");
            admin.setRole("ROLE_ADMIN");
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            
            userService.saveUser(admin);
            
            return "테스트 사용자 재생성 완료!<br>이메일: admin@test.com<br>비밀번호: admin123";
            
        } catch (Exception e) {
            return "오류 발생: " + e.getMessage();
        }
    }
    
    @PostMapping("/login")
    public String login(@RequestParam String email, 
                       @RequestParam String password,
                       @RequestParam(required = false) String rememberMe,
                       RedirectAttributes redirectAttributes) {
        
        try {
            // 사용자 인증
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );
            
            // 인증 성공 시 세션에 저장
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            redirectAttributes.addFlashAttribute("message", "로그인에 성공했습니다!");
            return "redirect:/";
            
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "이메일 또는 비밀번호가 올바르지 않습니다.");
            return "redirect:/login";
        }
    }
    
    @PostMapping("/signup")
    public String signup(@RequestParam String username,
                         @RequestParam String email,
                         @RequestParam String password,
                         @RequestParam String fullName,
                         RedirectAttributes redirectAttributes) {
        
        try {
            // 이메일 중복 확인
            if (userService.existsByEmail(email)) {
                redirectAttributes.addFlashAttribute("error", "이미 사용 중인 이메일입니다.");
                return "redirect:/signup";
            }
            
            // 사용자명 중복 확인
            if (userService.existsByUsername(username)) {
                redirectAttributes.addFlashAttribute("error", "이미 사용 중인 사용자명입니다.");
                return "redirect:/signup";
            }
            
            // 새 사용자 생성
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setFullName(fullName);
            user.setRole("USER");
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            
            userService.saveUser(user);
            
            redirectAttributes.addFlashAttribute("message", "회원가입이 완료되었습니다! 로그인해주세요.");
            return "redirect:/login";
            
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "회원가입 중 오류가 발생했습니다: " + e.getMessage());
            return "redirect:/signup";
        }
    }
    
    @GetMapping("/logout")
    public String logout(RedirectAttributes redirectAttributes) {
        SecurityContextHolder.clearContext();
        redirectAttributes.addFlashAttribute("message", "로그아웃되었습니다.");
        return "redirect:/";
    }
}
