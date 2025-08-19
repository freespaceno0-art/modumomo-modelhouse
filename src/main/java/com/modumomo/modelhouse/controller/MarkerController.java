package com.modumomo.modelhouse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/marker")
public class MarkerController {

    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveMarkerImage(@RequestParam("markerImage") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 이미지 저장 디렉토리 생성
            String uploadDir = "src/main/resources/static/images/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            
            // 파일명 설정
            String fileName = "custom-marker.png";
            Path filePath = Paths.get(uploadDir + fileName);
            
            // 기존 파일이 있으면 삭제
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
            
            // 새 파일 저장
            Files.write(filePath, file.getBytes());
            
            response.put("success", true);
            response.put("message", "마커 이미지가 성공적으로 저장되었습니다.");
            response.put("path", "/images/" + fileName);
            
            System.out.println("✅ 마커 이미지 저장 완료: " + filePath.toAbsolutePath());
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "마커 이미지 저장에 실패했습니다: " + e.getMessage());
            
            System.err.println("❌ 마커 이미지 저장 실패: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(500).body(response);
        }
    }
}
