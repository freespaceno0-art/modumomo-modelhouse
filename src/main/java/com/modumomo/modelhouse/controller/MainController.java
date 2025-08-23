package com.modumomo.modelhouse.controller;

import com.modumomo.modelhouse.entity.ModelHouse;
import com.modumomo.modelhouse.service.ModelHouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@Controller
public class MainController {
    
    @Autowired
    private ModelHouseService modelHouseService;
    
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("title", "Modumomo - 모델하우스");
        addUserInfoToModel(model);
        
        // 최근 등록된 모델하우스 데이터 가져오기
        try {
            List<ModelHouse> recentModelHouses = modelHouseService.getRecentModelHouses();
            model.addAttribute("recentModelHouses", recentModelHouses);
        } catch (Exception e) {
            System.err.println("모델하우스 데이터 로드 중 오류: " + e.getMessage());
            model.addAttribute("recentModelHouses", Collections.emptyList());
        }
        
        return "index";
    }
    
    @GetMapping("/map")
    public String map(Model model) {
        model.addAttribute("title", "Modumomo - 지도");
        addUserInfoToModel(model);
        
        // 모델하우스 데이터 로드 시 오류 방지
        try {
            List<ModelHouse> modelHouses = modelHouseService.getActiveModelHouses();
            model.addAttribute("modelHouses", modelHouses);
        } catch (Exception e) {
            System.err.println("지도 페이지 모델하우스 데이터 로드 중 오류: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("modelHouses", Collections.emptyList());
        }
        
        return "map";
    }
    
    @GetMapping("/admin")
    public String admin(Model model) {
        model.addAttribute("title", "Modumomo - 관리자");
        addUserInfoToModel(model);
        return "admin";
    }
    
    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("title", "Modumomo - 로그인");
        addUserInfoToModel(model);
        return "login";
    }
    
    @GetMapping("/signup")
    public String signup(Model model) {
        model.addAttribute("title", "Modumomo - 회원가입");
        addUserInfoToModel(model);
        return "signup";
    }
    
    @GetMapping("/search")
    public String search(@RequestParam(required = false) String q, Model model) {
        model.addAttribute("title", "Modumomo - 검색");
        addUserInfoToModel(model);
        return "redirect:/search?q=" + (q != null ? q : "");
    }
    
    @GetMapping("/test")
    public String test(Model model) {
        model.addAttribute("title", "Modumomo - 기능 테스트");
        addUserInfoToModel(model);
        return "test";
    }
    
    // 모델하우스 데이터 API 엔드포인트
    @GetMapping("/api/modelhouses")
    @ResponseBody
    public List<ModelHouse> getModelHouses() {
        try {
            return modelHouseService.getActiveModelHouses();
        } catch (Exception e) {
            System.err.println("모델하우스 API 호출 중 오류: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private void addUserInfoToModel(Model model) {
        // 기본값 설정
        model.addAttribute("isLoggedIn", false);
        model.addAttribute("isAdmin", false);
        model.addAttribute("currentUser", null);
        
        try {
            // Spring Security 컨텍스트에서 인증 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication != null && authentication.isAuthenticated() && 
                !"anonymousUser".equals(authentication.getName())) {
                
                String username = authentication.getName();
                model.addAttribute("currentUser", username);
                model.addAttribute("isLoggedIn", true);
                
                // 관리자 역할 확인
                if (authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                    model.addAttribute("isAdmin", true);
                }
            }
        } catch (Exception e) {
            System.err.println("사용자 정보 추가 중 오류: " + e.getMessage());
            // 오류 발생 시 기본값 유지
        }
    }
}
