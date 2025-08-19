# 🚀 Firebase + GitHub 연동 배포 가이드

## 📋 개요
이 문서는 Modumomo ModelHouse 프로젝트를 Firebase Hosting에 배포하는 방법을 설명합니다.

## 🔧 사전 준비

### 1. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `modumomo-modelhouse`
4. Google Analytics 활성화 (선택사항)
5. 프로젝트 생성 완료

### 2. Firebase Hosting 활성화
1. Firebase Console에서 "Hosting" 메뉴 클릭
2. "시작하기" 클릭
3. "도메인 추가" 클릭
4. 기본 도메인 확인 (예: `modumomo-modelhouse.web.app`)

### 3. Firebase CLI 설치
```bash
npm install -g firebase-tools
```

### 4. Firebase 로그인
```bash
firebase login
```

## 🚀 배포 방법

### 방법 1: GitHub Actions 자동 배포 (권장)

#### 1단계: GitHub Secrets 설정
GitHub 저장소 → Settings → Secrets and variables → Actions에서 다음 시크릿 추가:

- `FIREBASE_SERVICE_ACCOUNT`: Firebase 서비스 계정 JSON 키
- `GITHUB_TOKEN`: 자동으로 설정됨

#### 2단계: Firebase 서비스 계정 키 생성
1. Firebase Console → 프로젝트 설정 → 서비스 계정
2. "새 비공개 키 생성" 클릭
3. 다운로드된 JSON 파일 내용을 `FIREBASE_SERVICE_ACCOUNT` 시크릿에 복사

#### 3단계: 자동 배포
- `main` 또는 `master` 브랜치에 푸시하면 자동으로 배포됩니다
- GitHub Actions 탭에서 배포 진행 상황을 확인할 수 있습니다

### 방법 2: 수동 배포

#### 1단계: 프로젝트 빌드
```bash
./mvnw clean package -DskipTests
```

#### 2단계: Firebase 배포 디렉토리 생성
```bash
mkdir -p firebase-deploy
cp -r src/main/resources/static/* firebase-deploy/
cp -r src/main/resources/templates/* firebase-deploy/
cp target/*.jar firebase-deploy/
```

#### 3단계: Firebase 배포
```bash
firebase deploy --only hosting
```

## 🌐 도메인 설정

### 커스텀 도메인 연결
1. Firebase Console → Hosting → 사용자 정의 도메인
2. "도메인 추가" 클릭
3. 도메인 입력 (예: `modelhouse.modumomo.com`)
4. DNS 설정 안내에 따라 레코드 추가

### DNS 설정 예시
```
Type: A
Name: @
Value: 151.101.1.195

Type: CNAME
Name: www
Value: modumomo-modelhouse.web.app
```

## 📱 배포 후 확인

### 1. 기본 도메인 확인
- `https://modumomo-modelhouse.web.app` 접속
- 정상적으로 페이지가 로드되는지 확인

### 2. 기능 테스트
- 메인 페이지 로딩
- 로그인/회원가입
- 모델하우스 목록 조회
- 지도 기능

## 🔄 업데이트 배포

### 자동 배포 (GitHub Actions)
- 코드 변경 후 `main` 브랜치에 푸시
- GitHub Actions가 자동으로 빌드 및 배포

### 수동 배포
```bash
git pull origin main
./mvnw clean package -DskipTests
firebase deploy --only hosting
```

## 🚨 문제 해결

### 일반적인 문제들

#### 1. 빌드 실패
- Java 버전 확인 (Java 17+ 필요)
- Maven 의존성 문제 해결
- 테스트 코드 오류 수정

#### 2. 배포 실패
- Firebase 프로젝트 ID 확인
- 서비스 계정 키 유효성 검증
- 네트워크 연결 상태 확인

#### 3. 페이지 로딩 오류
- 정적 파일 경로 확인
- Firebase Hosting 설정 검증
- 브라우저 캐시 삭제

### 로그 확인
```bash
# Firebase 로그
firebase hosting:log

# GitHub Actions 로그
# GitHub 저장소 → Actions 탭에서 확인
```

## 📚 추가 리소스

- [Firebase Hosting 문서](https://firebase.google.com/docs/hosting)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Spring Boot 배포 가이드](https://spring.io/guides/gs/spring-boot/)

## 🤝 지원

배포 관련 문제가 발생하면:
1. GitHub Issues에 문제 등록
2. Firebase Console에서 로그 확인
3. GitHub Actions 로그 분석

---

**🚀 성공적인 배포를 위한 팁:**
- 항상 `main` 브랜치에서 배포
- 배포 전 로컬에서 테스트
- 정기적인 백업 및 모니터링
