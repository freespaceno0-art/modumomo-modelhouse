// Simple Model House Cards Display
document.addEventListener('DOMContentLoaded', function() {
    const carouselTrack = document.querySelector('.carousel-track');
    
    if (carouselTrack) {
        // 카드 클릭 이벤트 추가
        const items = carouselTrack.querySelectorAll('.carousel-item');
        
        items.forEach((item, index) => {
            item.addEventListener('click', function() {
                const modelId = this.getAttribute('data-model-id');
                const lat = this.getAttribute('data-lat');
                const lng = this.getAttribute('data-lng');
                
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
    }
    
    // Navigation function
    function navigateToMap(lat, lng, modelId) {
        const mapUrl = `/map?lat=${lat}&lng=${lng}&modelId=${modelId}`;
        window.location.href = mapUrl;
    }
    

    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        // Search button click event
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
        
        // Enter key press event
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Search function
        function performSearch() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // Add search animation
                searchBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    searchBtn.style.transform = 'scale(1)';
                }, 150);
                
                // Navigate to map page with search term
                const mapUrl = `/map?search=${encodeURIComponent(searchTerm)}`;
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
