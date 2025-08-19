package com.modumomo.modelhouse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.stereotype.Service;

import java.util.Random;

// @Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * 이메일 인증 코드를 생성하고 발송합니다.
     * @param email 수신자 이메일
     * @return 생성된 인증 코드
     */
    public String sendVerificationCode(String email) {
        // 6자리 인증 코드 생성
        String verificationCode = generateVerificationCode();
        
        // 개발 환경에서는 콘솔에 출력 (실제 이메일 발송 대신)
        System.out.println("=== 이메일 인증 코드 (개발 환경) ===");
        System.out.println("수신자: " + email);
        System.out.println("인증 코드: " + verificationCode);
        System.out.println("================================");
        
        // 실제 이메일 발송 시도 (설정이 완료되면 활성화)
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("[모두의 모델하우스] 이메일 인증 코드");
            message.setText("안녕하세요!\n\n모두의 모델하우스 회원가입을 위한 이메일 인증 코드입니다.\n\n" +
                    "인증 코드: " + verificationCode + "\n\n" +
                    "이 코드는 3분간 유효합니다.\n" +
                    "본인이 요청하지 않은 경우 무시하셔도 됩니다.\n\n" +
                    "감사합니다.\n모두의 모델하우스 팀");
            
            mailSender.send(message);
            System.out.println("✅ 실제 이메일 발송 성공!");
        } catch (Exception e) {
            System.out.println("⚠️ 실제 이메일 발송 실패 (개발 환경에서는 정상): " + e.getMessage());
            // 개발 환경에서는 이메일 발송 실패를 무시하고 계속 진행
        }
        
        return verificationCode;
    }

    /**
     * 6자리 인증 코드를 생성합니다.
     * @return 생성된 인증 코드
     */
    private String generateVerificationCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        
        for (int i = 0; i < 6; i++) {
            code.append(random.nextInt(10));
        }
        
        return code.toString();
    }
}
