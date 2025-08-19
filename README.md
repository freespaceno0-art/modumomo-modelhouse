# 모두의 모델하우스 (Modumomo ModelHouse)

## 📋 프로젝트 소개
부동산 모델하우스 정보를 제공하는 웹 애플리케이션입니다.

## 🚀 기술 스택
- **Backend**: Spring Boot 3.5.4, Spring Security, JPA/Hibernate
- **Database**: MariaDB
- **Frontend**: Thymeleaf, HTML5, CSS3, JavaScript
- **Build Tool**: Maven

## 🏗️ 프로젝트 구조
```
src/
├── main/
│   ├── java/
│   │   └── com/modumomo/modelhouse/
│   │       ├── config/          # Spring Security 설정
│   │       ├── controller/      # 컨트롤러
│   │       ├── entity/          # JPA 엔티티
│   │       ├── repository/      # 데이터 접근 계층
│   │       └── service/         # 비즈니스 로직
│   └── resources/
│       ├── static/              # 정적 리소스 (CSS, JS, 이미지)
│       ├── templates/           # Thymeleaf 템플릿
│       └── application.properties
```

## 🚀 실행 방법

### 1. 데이터베이스 설정
```sql
CREATE DATABASE modumomo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 애플리케이션 실행
```bash
./mvnw spring-boot:run
```

### 3. 접속
- **메인 페이지**: http://localhost:8080
- **로그인**: http://localhost:8080/login
- **회원가입**: http://localhost:8080/signup

## 🔐 기본 계정
- **관리자**: admin@test.com / admin123
- **일반 사용자**: user1@example.com / admin123

## 📱 주요 기능
- 모델하우스 목록 조회
- 지도 기반 위치 검색
- 사용자 인증 (로그인/회원가입)
- 관리자 페이지

## 🌐 배포
- **Backend**: Spring Boot JAR 파일로 배포
- **Frontend**: Firebase Hosting (GitHub Actions 연동)

## 📝 개발 환경
- Java 17+
- Maven 3.6+
- MariaDB 10.5+
- Spring Boot 3.5.4

## 🤝 기여 방법
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스
이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의
프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.
