package com.modumomo.modelhouse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "model_houses")
public class ModelHouse {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String houseName;
    
    @Column(nullable = false)
    private String houseAddress;
    
    @Column(nullable = false)
    private String housePhone;
    
    @Column(nullable = false)
    private String houseCategory;
    
    @Column(nullable = false)
    private Integer houseType;
    
    @Column(nullable = false)
    private String housePrice;
    
    @Column(columnDefinition = "TEXT")
    private String houseDescription;
    
    @Column(nullable = false)
    private LocalDateTime registrationDate;
    
    @Column(nullable = false)
    private LocalDateTime endDate;
    
    @Column(nullable = false)
    private Integer remainingDays;
    
    @Column(nullable = false)
    private Double latitude;
    
    @Column(nullable = false)
    private Double longitude;
    
    @Column(columnDefinition = "TEXT")
    private String images;
    
    @Column(columnDefinition = "TEXT")
    private String qrCode;
    
    @Column(columnDefinition = "TEXT")
    private String representativeImage;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getHouseName() {
        return houseName;
    }
    
    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }
    
    public String getHouseAddress() {
        return houseAddress;
    }
    
    public void setHouseAddress(String houseAddress) {
        this.houseAddress = houseAddress;
    }
    
    public String getHousePhone() {
        return housePhone;
    }
    
    public void setHousePhone(String housePhone) {
        this.housePhone = housePhone;
    }
    
    public String getHouseCategory() {
        return houseCategory;
    }
    
    public void setHouseCategory(String houseCategory) {
        this.houseCategory = houseCategory;
    }
    
    public Integer getHouseType() {
        return houseType;
    }
    
    public void setHouseType(Integer houseType) {
        this.houseType = houseType;
    }
    
    public String getHousePrice() {
        return housePrice;
    }
    
    public void setHousePrice(String housePrice) {
        this.housePrice = housePrice;
    }
    
    public String getHouseDescription() {
        return houseDescription;
    }
    
    public void setHouseDescription(String houseDescription) {
        this.houseDescription = houseDescription;
    }
    
    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }
    
    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }
    
    public LocalDateTime getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
    
    public Integer getRemainingDays() {
        return remainingDays;
    }
    
    public void setRemainingDays(Integer remainingDays) {
        this.remainingDays = remainingDays;
    }
    
    public Double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
    
    public Double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    
    public String getImages() {
        return images;
    }
    
    public void setImages(String images) {
        this.images = images;
    }
    
    public String getQrCode() {
        return qrCode;
    }
    
    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }
    
    public String getRepresentativeImage() {
        return representativeImage;
    }
    
    public void setRepresentativeImage(String representativeImage) {
        this.representativeImage = representativeImage;
    }
}
