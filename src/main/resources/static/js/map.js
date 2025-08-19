// Enhanced Map Functionality for Model House Locations
let map;
let markers = [];

// 모델하우스 데이터 - 서버에서 동적으로 가져옴
let modelHouses = [];

// 서버에서 모델하우스 데이터 가져오기
async function loadModelHouses() {
    try {
        const response = await fetch('/api/modelhouses');
        if (response.ok) {
            modelHouses = await response.json();
            console.log('모델하우스 데이터 로드됨:', modelHouses);
            
            // 지도가 이미 초기화된 경우 마커 다시 추가
            if (map) {
                addModelHouseMarkers();
            }
        } else {
            console.error('모델하우스 데이터 로드 실패:', response.status);
        }
    } catch (error) {
        console.error('모델하우스 데이터 로드 중 오류:', error);
    }
}

// 지도 초기화
async function initMap() {
    console.log('initMap 함수 호출됨');
    
    const container = document.getElementById('map');
    if (!container) {
        console.error('map 컨테이너를 찾을 수 없습니다');
        return;
    }
    
    console.log('map 컨테이너 찾음:', container);
    
    // Kakao Maps API가 로드되었는지 확인
    if (typeof kakao === 'undefined' || !kakao.maps) {
        console.error('Kakao Maps API가 로드되지 않았습니다');
        showMapError();
        return;
    }
    
    const options = {
        center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
        level: 8
    };
    
    console.log('지도 옵션:', options);
    
    try {
        map = new kakao.maps.Map(container, options);
        console.log('지도 생성 성공:', map);
        
        // 전역 변수로 map 저장
        window.kakaoMap = map;
        
        // 모델하우스 데이터 로드 후 마커 추가
        await loadModelHouses();
        
        // 지도 클릭 이벤트
        kakao.maps.event.addListener(map, 'click', function() {
            closeInfo();
        });
        
        // URL 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const modelId = urlParams.get('modelId');
        const lat = urlParams.get('lat');
        const lng = urlParams.get('lng');
        const searchTerm = urlParams.get('search');
        const houseName = urlParams.get('houseName');
        
        console.log('URL 파라미터:', { modelId, lat, lng, searchTerm, houseName });
        
        if (searchTerm) {
            // 검색어가 있는 경우 검색 결과 표시
            performSearch(searchTerm, map);
        } else if (lat && lng && modelId) {
            // 메인 페이지에서 카드 클릭으로 넘어온 경우
            const position = new kakao.maps.LatLng(parseFloat(lat), parseFloat(lng));
            map.setCenter(position);
            map.setLevel(1); // 최대 확대
            
            // 해당 모델하우스 정보 표시
            const modelHouse = modelHouses.find(house => house.id == modelId);
            if (modelHouse) {
                // 지도가 이동한 후 정보 패널 표시
                setTimeout(() => {
                    showModelHouseInfo(modelHouse);
                }, 500);
            } else if (houseName) {
                // 데이터베이스에 없는 경우 URL 파라미터로 전달된 정보로 표시
                const tempHouse = {
                    id: modelId,
                    name: houseName,
                    type: '등록된 모델하우스',
                    address: '주소 정보 없음',
                    phone: '연락처 정보 없음',
                    price: '가격 정보 없음',
                    description: '관리자 페이지에서 등록된 모델하우스입니다.'
                };
                setTimeout(() => {
                    showModelHouseInfo(tempHouse);
                }, 500);
            }
        }
        
    } catch (error) {
        console.error('지도 생성 실패:', error);
        showMapError();
    }
}

// 지도 로드 오류 시 표시할 메시지
function showMapError() {
    const container = document.getElementById('map');
    if (container) {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #f8f9fa; color: #6c757d;">
                <i class="fas fa-map-marked-alt" style="font-size: 3rem; margin-bottom: 1rem; color: #26a69a;"></i>
                <h3>지도를 불러올 수 없습니다</h3>
                <p>Kakao Maps API 키가 유효하지 않거나 네트워크 문제가 발생했습니다.</p>
                <p>관리자에게 문의하세요.</p>
            </div>
        `;
    }
}

// 모델하우스 마커 추가
function addModelHouseMarkers() {
    // 기존 마커들 제거
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    modelHouses.forEach(house => {
        // 마커 생성 - ModelHouse 엔티티 필드명과 일치
        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(house.latitude, house.longitude),
            map: map
        });
        
        // 마커에 클릭 이벤트 추가
        kakao.maps.event.addListener(marker, 'click', function() {
            // 해당 위치로 최대 확대
            const position = new kakao.maps.LatLng(house.latitude, house.longitude);
            map.setCenter(position);
            map.setLevel(1); // 최대 확대 (레벨 1)
            
            // 모델하우스 정보 표시
            showModelHouseInfo(house);
            
            // 마커 클릭 효과 (애니메이션)
            marker.setZIndex(1000);
            setTimeout(() => {
                marker.setZIndex(1);
            }, 1000);
        });
        
        // 마커에 툴팁 추가
        const infowindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;">${house.houseName}</div>`
        });
        
        kakao.maps.event.addListener(marker, 'mouseover', function() {
            infowindow.open(map, marker);
        });
        
        kakao.maps.event.addListener(marker, 'mouseout', function() {
            infowindow.close();
        });
        
        // 마커 배열에 저장
        markers.push(marker);
    });
}

// 모델하우스 정보 표시
function showModelHouseInfo(house) {
    const infoPanel = document.getElementById('modelhouseInfo');
    
    // 정보 업데이트 - ModelHouse 엔티티 필드명과 일치
    document.getElementById('infoTitle').textContent = `${house.houseName} (${house.houseCategory})`;
    document.getElementById('infoAddress').textContent = house.houseAddress;
    document.getElementById('infoPhone').textContent = house.housePhone;
    document.getElementById('infoType').textContent = house.houseCategory;
    document.getElementById('infoPrice').textContent = house.housePrice;
    document.getElementById('infoDescription').textContent = house.houseDescription;
    
    // QR 코드 업데이트
    const qrCodeImg = document.getElementById('infoQrCode');
    if (qrCodeImg) {
        qrCodeImg.src = house.qrCode;
        qrCodeImg.alt = `${house.name} QR 코드`;
    }
    
    // 이미지 갤러리 업데이트
    const imageGallery = document.getElementById('infoImageGallery');
    if (imageGallery && house.images) {
        const galleryImages = imageGallery.querySelector('.gallery-images');
        if (galleryImages) {
            galleryImages.innerHTML = '';
            house.images.forEach((imageUrl, index) => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = `${house.houseName} 이미지 ${index + 1}`;
                img.className = 'gallery-image';
                img.style.cursor = 'pointer';
                
                // 이미지 클릭 시 모달 열기
                img.addEventListener('click', function() {
                    openImageModal(imageUrl);
                });
                
                galleryImages.appendChild(img);
            });
        }
    }
    
    // 등록 기간 및 잔여일 정보는 표시하지 않음 (숨김 처리)
    
    // 패널 표시
    infoPanel.classList.add('show');
}

// 검색 기능 구현
function performSearch(searchTerm, map) {
    // 검색 결과를 표시할 마커들
    const searchResults = searchModelHouses(searchTerm);
    
    if (searchResults.length > 0) {
        // 검색 결과가 있는 경우
        const bounds = new kakao.maps.LatLngBounds();
        
        searchResults.forEach(result => {
            const position = new kakao.maps.LatLng(result.lat, result.lng);
            const marker = addMarker(position, result.name, map);
            
            // 마커 클릭 이벤트
            kakao.maps.event.addListener(marker, 'click', function() {
                const modelHouse = modelHouses.find(house => house.id == result.id);
                if (modelHouse) {
                    showModelHouseInfo(modelHouse);
                }
            });
            
            bounds.extend(position);
        });
        
        // 검색 결과가 모두 보이도록 지도 범위 조정
        map.setBounds(bounds);
        
        // 검색 결과 정보 표시
        showSearchResults(searchResults);
    } else {
        // 검색 결과가 없는 경우
        showNoResults(searchTerm);
    }
}

// 모델하우스 검색 함수
function searchModelHouses(searchTerm) {
    const results = [];
    
    modelHouses.forEach(house => {
        // 지역명으로 검색 (주소에서)
        if (house.address.includes(searchTerm)) {
            results.push({
                id: house.id,
                name: house.name,
                lat: house.lat,
                lng: house.lng,
                location: house.address.split(' ')[1] || house.address.split(' ')[0],
                type: house.type
            });
        }
        // 모델하우스 이름으로 검색
        else if (house.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
                id: house.id,
                name: house.name,
                lat: house.lat,
                lng: house.lng,
                location: house.address.split(' ')[1] || house.address.split(' ')[0],
                type: house.type
            });
        }
        // 하우스 타입으로 검색
        else if (house.type.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
                id: house.id,
                name: house.name,
                lat: house.lat,
                lng: house.lng,
                location: house.address.split(' ')[1] || house.address.split(' ')[0],
                type: house.type
            });
        }
    });
    
    return results;
}

// 검색 결과 표시
function showSearchResults(results) {
    const infoPanel = document.querySelector('.modelhouse-info');
    if (infoPanel) {
        // 기존 내용을 숨기고 검색 결과만 표시
        infoPanel.innerHTML = `
            <button class="close-info" onclick="closeSearchResults()">&times;</button>
            <div class="search-results">
                <h3>검색 결과 (${results.length}개)</h3>
                <div class="results-list">
                    ${results.map(result => `
                        <div class="result-item" onclick="focusOnMarker(${result.lat}, ${result.lng})">
                            <div class="result-name">${result.name}</div>
                            <div class="result-location">${result.location} - ${result.type}타입</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // 검색 결과 패널을 보이게 함
        infoPanel.classList.add('show');
    }
}

// 검색 결과 없음 표시
function showNoResults(searchTerm) {
    const infoPanel = document.querySelector('.modelhouse-info');
    if (infoPanel) {
        infoPanel.innerHTML = `
            <button class="close-info" onclick="closeSearchResults()">&times;</button>
            <div class="no-results">
                <h3>검색 결과 없음</h3>
                <p>"${searchTerm}"에 대한 검색 결과를 찾을 수 없습니다.</p>
                <p>다른 키워드로 검색해보세요.</p>
            </div>
        `;
        
        // 검색 결과 패널을 보이게 함
        infoPanel.classList.add('show');
    }
}

// 검색 결과 닫기
function closeSearchResults() {
    const infoPanel = document.querySelector('.modelhouse-info');
    if (infoPanel) {
        // 원래 모델하우스 정보로 되돌리기
        infoPanel.innerHTML = `
            <button class="close-info" onclick="closeInfo()">&times;</button>
            <h3><i class="fas fa-home"></i> <span id="infoTitle">모델하우스 정보</span></h3>
            
            <!-- QR 코드 섹션 -->
            <div class="qr-section">
                <img id="infoQrCode" src="https://via.placeholder.com/150x150/000000/ffffff?text=QR" alt="QR 코드" class="qr-code">
            </div>
            
            <!-- 기본 정보 섹션 -->
            <div class="basic-info">
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span id="infoAddress">주소: 서울특별시 강남구</span>
                    <button class="copy-btn" onclick="copyAddress()">주소복사</button>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-phone"></i>
                    <span id="infoPhone">전화번호: 02-1234-5678</span>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-building"></i>
                    <span id="infoType">유형: 단독주택</span>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-dollar-sign"></i>
                    <span id="infoPrice">가격: 문의</span>
                </div>
                
                <div class="info-item description">
                    <i class="fas fa-info-circle"></i>
                    <span id="infoDescription">설명: 모델하우스 상세 설명</span>
                </div>
            </div>
            
            <!-- 등록 정보 섹션 (숨김 처리) -->
            <div class="registration-info" id="infoRegistration" style="display: none;">
                <div class="registration-dates">
                    <span><strong>등록일:</strong> 2025-01-01</span>
                    <span><strong>만료일:</strong> 2025-12-31</span>
                </div>
                <div class="remaining-days">
                    <strong>잔여일:</strong> 140일
                </div>
            </div>
            
            <!-- 이미지 갤러리 섹션 -->
            <div class="image-gallery" id="infoImageGallery">
                <h4>모델하우스 이미지</h4>
                <div class="gallery-images">
                    <!-- 이미지들이 동적으로 추가됩니다 -->
                </div>
            </div>
            
            <!-- 광고 섹션 -->
            <div class="advertisement-section">
                <h4>해당 광고:</h4>
                <div class="ad-banners">
                    <div class="ad-banner">
                        <img src="https://via.placeholder.com/250x100/ff6b6b/ffffff?text=광고+배너+1" alt="광고 1">
                        <p>KPOP DEMON HUNTERS GOLDEN OFFICIAL LYRIC VIDEO</p>
                    </div>
                    <div class="ad-banner">
                        <img src="https://via.placeholder.com/250x100/4ecdc4/ffffff?text=광고+배너+2" alt="광고 2">
                        <p>KPOP DEMON HUNTERS GOLDEN OFFICIAL LYRIC VIDEO</p>
                    </div>
                    <div class="ad-banner">
                        <img src="https://via.placeholder.com/250x100/45b7d1/ffffff?text=광고+배너+3" alt="광고 3">
                        <p>KPOP DEMON HUNTERS GOLDEN OFFICIAL LYRIC VIDEO</p>
                    </div>
                </div>
            </div>
        `;
        
        // 패널을 숨김
        infoPanel.classList.remove('show');
    }
}

// 마커에 포커스
function focusOnMarker(lat, lng) {
    const position = new kakao.maps.LatLng(lat, lng);
    map.setCenter(position);
    map.setLevel(1); // 최대 확대
}

// 마커 추가 함수
function addMarker(position, title, map) {
    const marker = new kakao.maps.Marker({
        position: position,
        map: map
    });
    
    // 마커에 툴팁 추가
    const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;">${title}</div>`
    });
    
    kakao.maps.event.addListener(marker, 'mouseover', function() {
        infowindow.open(map, marker);
    });
    
    kakao.maps.event.addListener(marker, 'mouseout', function() {
        infowindow.close();
    });
    
    return marker;
}

// 정보 패널 닫기
function closeInfo() {
    const infoPanel = document.querySelector('.modelhouse-info');
    if (infoPanel) {
        infoPanel.classList.remove('show');
    }
}

// 지도 리셋
function resetMap() {
    if (map) {
        map.setCenter(new kakao.maps.LatLng(37.5665, 126.9780));
        map.setLevel(8);
        closeInfo();
    }
}

// 모든 마커 표시
function showAllMarkers() {
    if (markers.length > 0) {
        const bounds = new kakao.maps.LatLngBounds();
        
        markers.forEach(marker => {
            bounds.extend(marker.getPosition());
        });
        
        map.setBounds(bounds);
        closeInfo();
    }
}

// 이미지 모달 열기
function openImageModal(imageUrl) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (modal && modalImage) {
        modalImage.src = imageUrl;
        modal.style.display = 'block';
        
        // 모달 외부 클릭 시 닫기
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImageModal();
            }
        });
    }
}

// 이미지 모달 닫기
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 모달 닫기 버튼 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeImageModal);
    }
});

// 주소 복사
function copyAddress() {
    const address = document.getElementById('infoAddress').textContent;
    navigator.clipboard.writeText(address).then(function() {
        // 복사 성공 시 피드백
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '복사됨!';
        copyBtn.style.background = '#4caf50';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#26a69a';
        }, 2000);
    }).catch(function(err) {
        console.error('주소 복사 실패:', err);
        alert('주소 복사에 실패했습니다.');
    });
}

// 페이지 로드 시 지도 초기화
window.addEventListener('load', function() {
    console.log('페이지 로드 완료');
    console.log('kakao 객체 확인:', typeof kakao);
    console.log('kakao.maps 확인:', typeof kakao !== 'undefined' ? typeof kakao.maps : 'undefined');
    
    // Kakao Maps API가 로드되었는지 확인
    if (typeof kakao !== 'undefined' && kakao.maps) {
        console.log('Kakao Maps API 로드됨, 지도 초기화 시작');
        initMap();
        initSearch();
    } else {
        console.log('Kakao Maps API 아직 로드되지 않음, 대기 시작');
        // API가 아직 로드되지 않은 경우 대기
        const checkKakao = setInterval(function() {
            if (typeof kakao !== 'undefined' && kakao.maps) {
                console.log('Kakao Maps API 로드 완료, 지도 초기화 시작');
                clearInterval(checkKakao);
                initMap();
                initSearch();
            }
        }, 100);
        
        // 10초 후 타임아웃
        setTimeout(() => {
            if (checkKakao) {
                clearInterval(checkKakao);
                console.error('Kakao Maps API 로드 타임아웃');
            }
        }, 10000);
    }
});

// 검색 기능 초기화
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        // 검색 버튼 클릭 이벤트
        searchBtn.addEventListener('click', function() {
            performSearchFromInput();
        });
        
        // Enter 키 입력 이벤트
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearchFromInput();
            }
        });
        
        // 검색 입력 필드 포커스 시 기존 검색 결과 제거
        searchInput.addEventListener('focus', function() {
            closeInfo();
        });
    }
}

// 검색 입력에서 검색 수행
function performSearchFromInput() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        // 검색 버튼 애니메이션
        const searchBtn = document.querySelector('.search-btn');
        searchBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            searchBtn.style.transform = 'scale(1)';
        }, 150);
        
        // 검색 수행
        performSearch(searchTerm, map);
        
        // 검색어 하이라이트 효과
        searchInput.style.borderColor = '#26a69a';
        setTimeout(() => {
            searchInput.style.borderColor = '';
        }, 2000);
    }
}

// 윈도우 리사이즈 시 지도 크기 조정
window.addEventListener('resize', function() {
    if (map) {
        map.relayout();
    }
});

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'Escape':
            closeInfo();
            break;
        case 'Home':
            resetMap();
            break;
        case 'm':
            showAllMarkers();
            break;
    }
});
