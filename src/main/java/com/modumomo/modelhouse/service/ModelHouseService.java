package com.modumomo.modelhouse.service;

import com.modumomo.modelhouse.entity.ModelHouse;
import com.modumomo.modelhouse.repository.ModelHouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ModelHouseService {
    
    @Autowired
    private ModelHouseRepository modelHouseRepository;
    
    // 최근 등록된 모델하우스 조회 (메인 페이지 카드용)
    public List<ModelHouse> getRecentModelHouses() {
        try {
            return modelHouseRepository.findRecentModelHouses();
        } catch (Exception e) {
            System.err.println("최근 모델하우스 조회 중 오류: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
    
    // 활성 모델하우스만 조회 (잔여일 > 0)
    public List<ModelHouse> getActiveModelHouses() {
        try {
            return modelHouseRepository.findActiveModelHouses();
        } catch (Exception e) {
            System.err.println("활성 모델하우스 조회 중 오류: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
    
    // 카테고리별 모델하우스 조회
    public List<ModelHouse> getModelHousesByCategory(String category) {
        return modelHouseRepository.findByHouseCategoryOrderByRegistrationDateDesc(category);
    }
    
    // 모델하우스 저장
    public ModelHouse saveModelHouse(ModelHouse modelHouse) {
        return modelHouseRepository.save(modelHouse);
    }
    
    // 모델하우스 수정
    public ModelHouse updateModelHouse(Long id, ModelHouse updatedHouse) {
        ModelHouse existingHouse = modelHouseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("모델하우스를 찾을 수 없습니다: " + id));
        
        existingHouse.setHouseName(updatedHouse.getHouseName());
        existingHouse.setHouseAddress(updatedHouse.getHouseAddress());
        existingHouse.setHousePhone(updatedHouse.getHousePhone());
        existingHouse.setHouseCategory(updatedHouse.getHouseCategory());
        existingHouse.setHouseType(updatedHouse.getHouseType());
        existingHouse.setHousePrice(updatedHouse.getHousePrice());
        existingHouse.setHouseDescription(updatedHouse.getHouseDescription());
        existingHouse.setEndDate(updatedHouse.getEndDate());
        existingHouse.setImages(updatedHouse.getImages());
        existingHouse.setQrCode(updatedHouse.getQrCode());
        
        // 잔여일 계산
        if (updatedHouse.getEndDate() != null) {
            long days = java.time.Duration.between(LocalDateTime.now(), updatedHouse.getEndDate()).toDays();
            existingHouse.setRemainingDays(Math.max(0, (int) days));
        }
        
        return modelHouseRepository.save(existingHouse);
    }
    
    // 모델하우스 삭제
    public void deleteModelHouse(Long id) {
        modelHouseRepository.deleteById(id);
    }
    
    // 모델하우스 연장
    public ModelHouse extendModelHouse(Long id, int additionalDays) {
        ModelHouse modelHouse = modelHouseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("모델하우스를 찾을 수 없습니다: " + id));
        
        LocalDateTime newEndDate = modelHouse.getEndDate().plusDays(additionalDays);
        modelHouse.setEndDate(newEndDate);
        
        // 잔여일 계산
        long days = java.time.Duration.between(LocalDateTime.now(), newEndDate).toDays();
        modelHouse.setRemainingDays(Math.max(0, (int) days));
        
        return modelHouseRepository.save(modelHouse);
    }
    
    // 검색 기능
    public List<ModelHouse> searchModelHouses(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getRecentModelHouses();
        }
        
        List<ModelHouse> nameResults = modelHouseRepository.findByHouseNameContainingIgnoreCase(searchTerm);
        List<ModelHouse> addressResults = modelHouseRepository.findByHouseAddressContainingIgnoreCase(searchTerm);
        
        // 중복 제거 및 합치기
        nameResults.addAll(addressResults);
        return nameResults.stream()
            .distinct()
            .sorted((a, b) -> b.getRegistrationDate().compareTo(a.getRegistrationDate()))
            .collect(Collectors.toList());
    }
}
