-- MariaDB 샘플 데이터 삽입 스크립트
-- 한글 데이터를 utf8mb4로 저장

-- 샘플 모델하우스 데이터 (한글 포함)
INSERT INTO model_houses (house_name, house_address, house_phone, house_category, house_type, house_price, house_description, registration_date, end_date, remaining_days, latitude, longitude, images, qr_code, representative_image) VALUES
('서울숲 모던하우스', '서울특별시 성동구 서울숲2길 18', '02-1234-5678', '아파트', 3, '5억원', '서울숲 근처의 모던한 아파트입니다.', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 30, 37.5447, 127.0559, '["/images/house1-1.jpg", "/images/house1-2.jpg"]', '', '/images/house1-main.jpg'),
('강남 프리미엄 오피스텔', '서울특별시 강남구 테헤란로 123', '02-2345-6789', '오피스텔', 2, '3억원', '강남 중심가의 프리미엄 오피스텔입니다.', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 30, 37.5248, 127.0400, '["/images/house2-1.jpg", "/images/house2-2.jpg"]', '', '/images/house2-main.jpg'),
('홍대 창업 오피스', '서울특별시 마포구 홍대로 123', '02-3456-7890', '상가', 1, '2억원', '홍대 근처의 창업 오피스입니다.', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 30, 37.5563, 126.9236, '["/images/house3-1.jpg", "/images/house3-2.jpg"]', '', '/images/house3-main.jpg');

-- 샘플 사용자 데이터
INSERT INTO users (username, password, email, full_name, role, created_at, updated_at) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@example.com', '관리자', 'ROLE_ADMIN', NOW(), NOW()),
('freespace_st', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'freespace_st@naver.com', '프리스페이스 관리자', 'ROLE_ADMIN', NOW(), NOW()),
('user1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user1@example.com', '일반사용자', 'ROLE_USER', NOW(), NOW());
