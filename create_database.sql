-- MariaDB 데이터베이스 생성 스크립트
-- 한글 지원을 위한 utf8mb4 문자셋 사용

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS modumomo_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 데이터베이스 사용
USE modumomo_db;

-- 데이터베이스 권한 확인 (필요시)
-- GRANT ALL PRIVILEGES ON modumomo_db.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;
