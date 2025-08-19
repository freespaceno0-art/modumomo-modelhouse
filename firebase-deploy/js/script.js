// 로그인 상태 관리
let isLoggedIn = false;
let currentUser = null;
let isAdmin = false;

// 페이지 로드 시 로그인 상태 확인
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

// 로그인 상태 확인
function checkLoginStatus() {
    // localStorage에서 로그인 상태 확인
    const loginData = localStorage.getItem('loginData');
    if (loginData) {
        const userData = JSON.parse(loginData);
        isLoggedIn = true;
        currentUser = userData.email;
        isAdmin = userData.role === 'ROLE_ADMIN';
        updateAuthButtons();
    } else {
        isLoggedIn = false;
        currentUser = null;
        isAdmin = false;
        updateAuthButtons();
    }
}

// 인증 버튼 업데이트
function updateAuthButtons() {
    const loggedOutDiv = document.querySelector('.auth-buttons-logged-out');
    const loggedInDiv = document.querySelector('.auth-buttons-logged-in');
    const adminSection = document.querySelector('.admin-section');
    const currentUserSpan = document.querySelector('.current-user');
    
    if (isLoggedIn) {
        // 로그인된 상태
        if (loggedOutDiv) loggedOutDiv.style.display = 'none';
        if (loggedInDiv) loggedInDiv.style.display = 'flex';
        if (currentUserSpan) currentUserSpan.textContent = currentUser;
        
        // 관리자 권한 확인
        if (adminSection) {
            adminSection.style.display = isAdmin ? 'flex' : 'none';
        }
    } else {
        // 로그인되지 않은 상태
        if (loggedOutDiv) loggedOutDiv.style.display = 'flex';
        if (loggedInDiv) loggedInDiv.style.display = 'none';
    }
}

// 로그아웃 함수
function logout() {
    // localStorage에서 로그인 데이터 제거
    localStorage.removeItem('loginData');
    
    // 로그인 상태 업데이트
    isLoggedIn = false;
    currentUser = null;
    isAdmin = false;
    
    // 버튼 상태 업데이트
    updateAuthButtons();
    
    // 메인 페이지로 리다이렉트
    window.location.href = 'index.html';
}

// 로그인 성공 시 호출되는 함수
function loginSuccess(userData) {
    // localStorage에 로그인 데이터 저장
    localStorage.setItem('loginData', JSON.stringify(userData));
    
    // 로그인 상태 업데이트
    isLoggedIn = true;
    currentUser = userData.email;
    isAdmin = userData.role === 'ROLE_ADMIN';
    
    // 버튼 상태 업데이트
    updateAuthButtons();
}

// 모델하우스 카드 클릭 이벤트 및 이미지 로드 관리
document.addEventListener('DOMContentLoaded', function() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    
    carouselItems.forEach(item => {
        // 이미지 로드 상태 확인 및 관리
        const image = item.querySelector('.representative-image');
        const noImageDiv = item.querySelector('.preview-image.no-image');
        
        if (image && noImageDiv) {
            // 이미지 로드 성공 시
            image.addEventListener('load', function() {
                this.style.display = 'block';
                if (noImageDiv) noImageDiv.style.display = 'none';
            });
            
            // 이미지 로드 실패 시
            image.addEventListener('error', function() {
                this.style.display = 'none';
                if (noImageDiv) noImageDiv.style.display = 'flex';
            });
            
            // 초기 상태 설정
            if (image.complete && image.naturalHeight !== 0) {
                image.style.display = 'block';
                if (noImageDiv) noImageDiv.style.display = 'none';
            } else {
                image.style.display = 'none';
                if (noImageDiv) noImageDiv.style.display = 'flex';
            }
        }
        
        // 클릭 이벤트
        item.addEventListener('click', function() {
            const modelId = this.getAttribute('data-model-id');
            const lat = this.getAttribute('data-lat');
            const lng = this.getAttribute('data-lng');
            
            // 모델하우스 상세 페이지로 이동 (향후 구현)
            console.log('모델하우스 클릭:', { modelId, lat, lng });
            
            // 임시로 지도 페이지로 이동
            if (lat && lng) {
                window.location.href = `map.html?lat=${lat}&lng=${lng}`;
            }
        });
    });
});

// 검색 기능
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            if (searchTerm) {
                // 검색 기능 구현 (향후)
                console.log('검색어:', searchTerm);
                alert(`"${searchTerm}" 검색 기능은 준비 중입니다.`);
            }
        });
    }
    
    // Enter 키로 검색
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
});

// Add smooth scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
