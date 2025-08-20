// Simple Model House Cards Display
document.addEventListener('DOMContentLoaded', function() {
    console.log('메인 페이지 JavaScript 로드됨');
    
    const carouselTrack = document.querySelector('.carousel-track');
    
    if (carouselTrack) {
        console.log('캐러셀 트랙 찾음:', carouselTrack);
        
        // 카드 클릭 이벤트 추가
        const items = carouselTrack.querySelectorAll('.carousel-item');
        console.log('캐러셀 아이템 개수:', items.length);
        
        items.forEach((item, index) => {
            item.addEventListener('click', function() {
                console.log('카드 클릭됨:', index);
                const modelId = this.getAttribute('data-model-id');
                const lat = this.getAttribute('data-lat');
                const lng = this.getAttribute('data-lng');
                
                console.log('카드 데이터:', { modelId, lat, lng });
                
                // 클릭 애니메이션
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // 지도 페이지로 이동 (해당 마커로 최대 확대)
                setTimeout(() => {
                    navigateToMap(lat, lng, modelId);
                }, 200);
            });
        });
        
        // Touch/swipe functionality
        let startX = 0;
        let currentX = 0;
        
        carouselTrack.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        carouselTrack.addEventListener('touchmove', function(e) {
            currentX = e.touches[0].clientX;
        });
        
        carouselTrack.addEventListener('touchend', function() {
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe left
                    // 카드 이동 로직 제거
                } else {
                    // Swipe right
                    // 카드 이동 로직 제거
                }
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                // 카드 이동 로직 제거
            } else if (e.key === 'ArrowRight') {
                // 카드 이동 로직 제거
            }
        });
    } else {
        console.error('캐러셀 트랙을 찾을 수 없습니다');
    }
    
    // Navigation function
    function navigateToMap(lat, lng, modelId) {
        console.log('지도 페이지로 이동:', { lat, lng, modelId });
        // Firebase Hosting용 경로 수정
        const mapUrl = `map.html?lat=${lat}&lng=${lng}&modelId=${modelId}`;
        console.log('이동할 URL:', mapUrl);
        window.location.href = mapUrl;
    }
    

    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        console.log('검색 요소들 찾음:', { searchInput, searchBtn });
        
        // Search button click event
        searchBtn.addEventListener('click', function() {
            console.log('검색 버튼 클릭됨');
            performSearch();
        });
        
        // Enter key press event
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('검색 엔터키 입력됨');
                performSearch();
            }
        });
        
        // Search function
        function performSearch() {
            const searchTerm = searchInput.value.trim();
            console.log('검색어:', searchTerm);
            
            if (searchTerm) {
                // Add search animation
                searchBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    searchBtn.style.transform = 'scale(1)';
                }, 150);
                
                // Navigate to map page with search term
                const mapUrl = `map.html?search=${encodeURIComponent(searchTerm)}`;
                console.log('검색 결과로 이동할 URL:', mapUrl);
                window.location.href = mapUrl;
            }
        }
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
