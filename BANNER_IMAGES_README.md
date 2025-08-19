# 🎨 배너 이미지 교체 가이드

## 📋 현재 상태
- **개발용**: `placehold.co`를 사용하여 임시 이미지 표시
- **실제 서비스용**: 로컬 이미지 파일로 교체 권장

## 🔄 이미지 교체 방법

### 1. 이미지 파일 준비
`src/main/resources/static/images/` 폴더에 다음 이미지들을 추가하세요:

```
src/main/resources/static/images/
├── ad-banner-1.jpg     # 광고 배너 1 (250x100px 권장)
├── ad-banner-2.jpg     # 광고 배너 2 (250x100px 권장)
├── ad-banner-3.jpg     # 광고 배너 3 (250x100px 권장)
└── qr-code.png         # QR 코드 (150x150px 권장)
```

### 2. HTML 파일 수정
`src/main/resources/templates/map.html`에서:

```html
<!-- 현재 (개발용) -->
<img src="https://placehold.co/250x100/ff6b6b/ffffff?text=광고+배너+1" alt="광고 1">

<!-- 변경 후 (실제 서비스용) -->
<img src="/images/ad-banner-1.jpg" alt="광고 1">
```

### 3. JavaScript 파일 수정
`src/main/resources/static/js/map.js`의 `closeSearchResults()` 함수에서도 동일하게 변경:

```javascript
// 현재 (개발용)
<img src="https://placehold.co/250x100/ff6b6b/ffffff?text=광고+배너+1" alt="광고 1">

// 변경 후 (실제 서비스용)
<img src="/images/ad-banner-1.jpg" alt="광고 1">
```

## 🎯 권장 이미지 사양

### 광고 배너
- **크기**: 250x100 픽셀
- **형식**: JPG 또는 PNG
- **용량**: 각각 50KB 이하
- **내용**: 부동산 관련 홍보, 모델하우스 소개 등

### QR 코드
- **크기**: 150x150 픽셀
- **형식**: PNG (투명 배경 권장)
- **용량**: 20KB 이하
- **내용**: 모델하우스 상세 정보 링크

## 🚀 성능 최적화 팁

1. **이미지 압축**: TinyPNG, ImageOptim 등으로 최적화
2. **WebP 형식**: 최신 브라우저 지원 시 WebP 사용 권장
3. **지연 로딩**: 중요하지 않은 이미지는 `loading="lazy"` 속성 추가
4. **CDN 사용**: 대용량 트래픽 시 CDN 서비스 활용

## 📱 반응형 이미지

```html
<!-- 다양한 화면 크기 지원 -->
<img src="/images/ad-banner-1.jpg" 
     srcset="/images/ad-banner-1-small.jpg 200w,
             /images/ad-banner-1.jpg 250w,
             /images/ad-banner-1-large.jpg 300w"
     sizes="(max-width: 768px) 200px, 250px"
     alt="광고 1">
```

## 🔧 자동화 스크립트

배너 이미지 교체를 자동화하려면:

```bash
# 이미지 교체 스크립트 실행
./scripts/replace-banner-images.sh
```

## 📞 문의사항
- 이미지 디자인 문의: 디자인팀
- 기술적 구현 문의: 개발팀
- 성능 최적화 문의: 인프라팀
