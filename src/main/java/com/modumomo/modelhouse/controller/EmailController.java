package com.modumomo.modelhouse.controller;

import com.modumomo.modelhouse.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// @RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    // 인증 코드를 임시로 저장 (실제로는 Redis나 데이터베이스 사용 권장)
    private static final ConcurrentHashMap<String, String> verificationCodes = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<String, Long> codeExpiryTimes = new ConcurrentHashMap<>();

    /**
     * 이메일 인증 코드를 발송합니다.
     * @param request 이메일 주소가 포함된 요청
     * @return 발송 결과
     */
    @PostMapping("/send-verification")
    public ResponseEntity<Map<String, Object>> sendVerificationCode(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            
            if (email == null || email.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "이메일 주소를 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            // 이메일 형식 검증
            if (!isValidEmail(email)) {
                response.put("success", false);
                response.put("message", "올바른 이메일 형식이 아닙니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 인증 코드 발송
            String verificationCode = emailService.sendVerificationCode(email);
            
            // 인증 코드 저장 (3분 유효)
            verificationCodes.put(email, verificationCode);
            codeExpiryTimes.put(email, System.currentTimeMillis() + (3 * 60 * 1000));
            
            response.put("success", true);
            response.put("message", "인증 코드가 발송되었습니다. 이메일을 확인해주세요.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "인증 코드 발송에 실패했습니다: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 이메일 인증 코드를 검증합니다.
     * @param request 이메일과 인증 코드가 포함된 요청
     * @return 검증 결과
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyCode(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            String code = request.get("code");
            
            if (email == null || code == null) {
                response.put("success", false);
                response.put("message", "이메일과 인증 코드를 모두 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            // 저장된 인증 코드 확인
            String storedCode = verificationCodes.get(email);
            Long expiryTime = codeExpiryTimes.get(email);
            
            if (storedCode == null || expiryTime == null) {
                response.put("success", false);
                response.put("message", "인증 코드가 만료되었거나 존재하지 않습니다. 다시 발송해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            // 만료 시간 확인
            if (System.currentTimeMillis() > expiryTime) {
                verificationCodes.remove(email);
                codeExpiryTimes.remove(email);
                response.put("success", false);
                response.put("message", "인증 코드가 만료되었습니다. 다시 발송해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            // 인증 코드 일치 확인
            if (!storedCode.equals(code)) {
                response.put("success", false);
                response.put("message", "인증 코드가 일치하지 않습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 인증 성공 시 저장된 코드 제거
            verificationCodes.remove(email);
            codeExpiryTimes.remove(email);
            
            response.put("success", true);
            response.put("message", "이메일 인증이 완료되었습니다.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "인증 코드 검증에 실패했습니다: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 이메일 형식을 검증합니다.
     * @param email 검증할 이메일 주소
     * @return 유효한 이메일 형식인지 여부
     */
    private boolean isValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email.matches(emailRegex);
    }
}
