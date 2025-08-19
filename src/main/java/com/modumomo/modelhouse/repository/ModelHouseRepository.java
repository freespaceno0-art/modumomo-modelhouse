package com.modumomo.modelhouse.repository;

import com.modumomo.modelhouse.entity.ModelHouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModelHouseRepository extends JpaRepository<ModelHouse, Long> {
    
    // 최근 등록된 모델하우스 조회 (등록일 기준 내림차순)
    @Query("SELECT m FROM ModelHouse m ORDER BY m.registrationDate DESC")
    List<ModelHouse> findRecentModelHouses();
    
    // 카테고리별 모델하우스 조회
    List<ModelHouse> findByHouseCategoryOrderByRegistrationDateDesc(String category);
    
    // 잔여일이 0보다 큰 활성 모델하우스만 조회
    @Query("SELECT m FROM ModelHouse m WHERE m.remainingDays > 0 ORDER BY m.registrationDate DESC")
    List<ModelHouse> findActiveModelHouses();
    
    // 이름으로 검색
    List<ModelHouse> findByHouseNameContainingIgnoreCase(String houseName);
    
    // 주소로 검색
    List<ModelHouse> findByHouseAddressContainingIgnoreCase(String address);
}
