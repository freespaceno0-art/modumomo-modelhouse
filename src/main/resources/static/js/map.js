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
        // 오류 발생 시 더미 데이터로 테스트
        modelHouses = [
            {
                id: 1,
                name: '테스트 모델하우스',
                address: '서울특별시 강남구',
                latitude: 37.5665,
                longitude: 126.9780,
                phone: '02-1234-5678',
                category: '아파트',
                type: '3타입',
                price: '5억원'
            }
        ];
        console.log('더미 데이터로 테스트:', modelHouses);
    }
}

// 지도 초기화
async function initMap() {
    try {
        console.log('=== 지도 초기화 시작 ===');
        
        // 지도 컨테이너 확인
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.error('지도 컨테이너를 찾을 수 없습니다');
            return;
        }
        
        console.log('지도 컨테이너 찾음:', mapContainer);
        
        // Kakao Maps API 확인 (더 안전한 방식)
        if (typeof kakao === 'undefined' || !kakao.maps || !kakao.maps.LatLng || typeof kakao.maps.LatLng !== 'function') {
            console.error('Kakao Maps API가 완전히 로드되지 않았습니다');
            console.log('kakao 객체:', typeof kakao);
            console.log('kakao.maps:', kakao?.maps);
            console.log('kakao.maps.LatLng:', kakao?.maps?.LatLng);
            console.log('kakao.maps.LatLng 타입:', typeof kakao?.maps?.LatLng);
            
            // API 재로딩 시도
            setTimeout(() => {
                if (typeof kakao !== 'undefined' && kakao.maps && kakao.maps.LatLng && typeof kakao.maps.LatLng === 'function') {
                    console.log('API 재로딩 후 지도 초기화 재시도');
                    initMap();
                } else {
                    console.error('API 재로딩 실패, 오류 표시');
                    showMapError();
                }
            }, 1000);
            return;
        }
        
        console.log('Kakao Maps API 확인됨');
        console.log('사용 가능한 API 메서드들:', Object.keys(kakao.maps));
        
        // URL 파라미터에서 좌표 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const lat = parseFloat(urlParams.get('lat')) || 37.5665;
        const lng = parseFloat(urlParams.get('lng')) || 126.9780;
        
        console.log('지도 좌표:', lat, lng);
        
        // 지도 생성 (더 안전한 방식)
        let mapOptions;
        try {
            mapOptions = {
                center: new kakao.maps.LatLng(lat, lng),
                level: 8
            };
            console.log('지도 옵션 설정 성공:', mapOptions);
        } catch (latLngError) {
            console.error('LatLng 생성 실패:', latLngError);
            // 대안 방법 시도
            try {
                mapOptions = {
                    center: { lat: lat, lng: lng },
                    level: 8
                };
                console.log('대안 지도 옵션 사용:', mapOptions);
            } catch (altError) {
                console.error('대안 방법도 실패:', altError);
                showMapError();
                return;
            }
        }
        
        // 지도 인스턴스 생성
        let mapInstance;
        try {
            mapInstance = new kakao.maps.Map(mapContainer, mapOptions);
            console.log('지도 인스턴스 생성 성공:', mapInstance);
        } catch (mapError) {
            console.error('지도 인스턴스 생성 실패:', mapError);
            showMapError();
            return;
        }
        
        map = mapInstance;
        
        // 지도 로딩 완료 이벤트
        try {
            kakao.maps.event.addListener(map, 'tilesloaded', function() {
                console.log('지도 타일 로딩 완료');
                mapContainer.classList.add('loaded');
            });
        } catch (eventError) {
            console.warn('지도 이벤트 리스너 추가 실패:', eventError);
        }
        
        // 지도 로딩 실패 이벤트
        try {
            kakao.maps.event.addListener(map, 'error', function(error) {
                console.error('지도 로딩 오류:', error);
            });
        } catch (eventError) {
            console.warn('지도 오류 이벤트 리스너 추가 실패:', eventError);
        }
        
        // 모델하우스 데이터 로드 및 마커 표시
        try {
            await loadModelHouses();
            addModelHouseMarkers();
        } catch (dataError) {
            console.warn('모델하우스 데이터 로드 실패:', dataError);
        }
        
        console.log('=== 지도 초기화 완료 ===');
        
    } catch (error) {
        console.error('지도 초기화 중 오류 발생:', error);
        console.error('오류 스택:', error.stack);
        showMapError();
    }
}

// Kakao Maps API 로딩 대기
function waitForKakaoMaps() {
    return new Promise((resolve, reject) => {
        // 이미 로드된 경우 즉시 resolve
        if (typeof kakao !== 'undefined' && kakao.maps) {
            console.log('✅ Kakao Maps API 이미 로드됨');
            resolve();
            return;
        }
        
        const checkKakao = () => {
            if (typeof kakao !== 'undefined' && kakao.maps) {
                console.log('✅ Kakao Maps API 로딩 완료');
                resolve();
            } else {
                console.log('⏳ Kakao Maps API 로딩 대기 중...');
                setTimeout(checkKakao, 200); // 200ms마다 체크 (빈도 감소)
            }
        };
        
        // 30초 타임아웃
        const timeout = setTimeout(() => {
            reject(new Error('Kakao Maps API 로딩 타임아웃'));
        }, 30000);
        
        // 타임아웃 정리
        const checkKakaoWithTimeout = () => {
            if (typeof kakao !== 'undefined' && kakao.maps) {
                clearTimeout(timeout);
                console.log('✅ Kakao Maps API 로딩 완료');
                resolve();
            } else {
                setTimeout(checkKakaoWithTimeout, 200);
            }
        };
        
        checkKakaoWithTimeout();
    });
}

// 지도 오류 표시
function showMapError() {
    console.error('지도 로딩 실패 - 오류 표시 시작');
    
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('지도 컨테이너를 찾을 수 없어 오류를 표시할 수 없습니다');
        return;
    }
    
    // 로딩 스피너 제거
    mapContainer.classList.add('loaded');
    
    // 오류 메시지 표시
    mapContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #f8f9fa; color: #6c757d; text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">🗺️</div>
            <h3 style="margin-bottom: 15px; color: #495057;">지도를 불러올 수 없습니다</h3>
            <p style="margin-bottom: 20px; line-height: 1.6;">
                Kakao Maps API 로딩에 실패했습니다.<br>
                잠시 후 다시 시도해주세요.
            </p>
            <div style="margin-bottom: 20px;">
                <button onclick="location.reload()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                    🔄 페이지 새로고침
                </button>
                <button onclick="initMap()" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    🗺️ 지도 다시 시도
                </button>
            </div>
            <div style="font-size: 12px; color: #adb5bd; margin-top: 20px;">
                문제가 지속되면 관리자에게 문의해주세요.
            </div>
        </div>
    `;
    
    console.log('지도 오류 표시 완료');
}

// 모델하우스 마커 추가
function addModelHouseMarkers() {
    // 기존 마커들 제거
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    console.log('마커 추가 시작, 모델하우스 수:', modelHouses.length);
    
    modelHouses.forEach(house => {
        // 위도/경도 확인
        const lat = house.latitude || house.lat;
        const lng = house.longitude || house.lng;
        
        if (!lat || !lng) {
            console.warn('위도/경도 정보가 없는 모델하우스:', house);
            return;
        }
        
        // 마커 생성
        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lat, lng),
            map: map
        });
        
        // 마커에 클릭 이벤트 추가
        kakao.maps.event.addListener(marker, 'click', function() {
            // 해당 위치로 최대 확대
            const position = new kakao.maps.LatLng(lat, lng);
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
        const houseName = house.name || house.houseName || '모델하우스';
        const infowindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;">${houseName}</div>`
        });
        
        kakao.maps.event.addListener(marker, 'mouseover', function() {
            infowindow.open(map, marker);
        });
        
        kakao.maps.event.addListener(marker, 'mouseout', function() {
            infowindow.close();
        });
        
        // 마커 배열에 저장
        markers.push(marker);
        
        console.log(`마커 추가됨: ${houseName} (${lat}, ${lng})`);
    });
    
    console.log(`총 ${markers.length}개의 마커가 추가되었습니다.`);
}

// 모델하우스 정보 표시
function showModelHouseInfo(house) {
    const infoPanel = document.getElementById('modelhouseInfo');
    
    // 정보 업데이트 - 필드명을 통일하고 안전하게 처리
    const titleElement = document.getElementById('infoTitle');
    const addressElement = document.getElementById('infoAddress');
    const phoneElement = document.getElementById('infoPhone');
    const typeElement = document.getElementById('infoType');
    const priceElement = document.getElementById('infoPrice');
    const descriptionElement = document.getElementById('infoDescription');
    
    if (titleElement) {
        titleElement.textContent = house.name || house.houseName || '모델하우스 정보';
    }
    
    if (addressElement) {
        addressElement.textContent = `주소: ${house.address || house.houseAddress || '주소 정보 없음'}`;
    }
    
    if (phoneElement) {
        phoneElement.textContent = `전화번호: ${house.phone || house.housePhone || '연락처 정보 없음'}`;
    }
    
    if (typeElement) {
        typeElement.textContent = `유형: ${house.category || house.houseCategory || '유형 정보 없음'}`;
    }
    
    if (priceElement) {
        priceElement.textContent = `가격: ${house.price || house.housePrice || '가격 정보 없음'}`;
    }
    
    if (descriptionElement) {
        descriptionElement.textContent = `설명: ${house.description || house.houseDescription || '설명 정보 없음'}`;
    }
    
    // QR 코드 업데이트 (있는 경우에만)
    const qrCodeImg = document.getElementById('infoQrCode');
    if (qrCodeImg && house.qrCode) {
        qrCodeImg.src = house.qrCode;
        qrCodeImg.alt = `${house.name || house.houseName || '모델하우스'} QR 코드`;
    }
    
    // 이미지 갤러리 업데이트 (있는 경우에만)
    const imageGallery = document.getElementById('infoImageGallery');
    if (imageGallery && house.images && house.images.length > 0) {
        const galleryImages = imageGallery.querySelector('.gallery-images');
        if (galleryImages) {
            galleryImages.innerHTML = '';
            house.images.forEach((imageUrl, index) => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = `${house.name || house.houseName || '모델하우스'} 이미지 ${index + 1}`;
                img.className = 'gallery-image';
                img.style.cursor = 'pointer';
                
                // 이미지 클릭 시 모달 열기
                img.addEventListener('click', function() {
                    openImageModal(imageUrl);
                });
                
                galleryImages.appendChild(img);
            });
        }
    } else if (imageGallery) {
        // 이미지가 없는 경우 안내 메시지
        const galleryImages = imageGallery.querySelector('.gallery-images');
        if (galleryImages) {
            galleryImages.innerHTML = '<p style="color: #7f8c8d; text-align: center;">등록된 이미지가 없습니다.</p>';
        }
    }
    
    // 패널 표시
    infoPanel.classList.add('show');
    
    console.log('모델하우스 정보 표시됨:', house);
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
                <img id="infoQrCode" src="https://placehold.co/150x150/000000/ffffff?text=QR" alt="QR 코드" class="qr-code">
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
                    <!-- 개발용: placehold.co 사용, 실제 서비스용: 로컬 이미지로 교체 권장 -->
                    <div class="ad-banner">
                        <!-- 실제 서비스용: <img src="/images/ad-banner-1.jpg" alt="광고 1"> -->
                        <img src="https://placehold.co/250x100/ff6b6b/ffffff?text=광고+배너+1" alt="광고 1">
                        <p>KPOP DEMON HUNTERS GOLDEN OFFICIAL LYRIC VIDEO</p>
                    </div>
                    <div class="ad-banner">
                        <!-- 실제 서비스용: <img src="/images/ad-banner-2.jpg" alt="광고 2"> -->
                        <img src="https://placehold.co/250x100/4ecdc4/ffffff?text=광고+배너+2" alt="광고 2">
                        <p>KPOP DEMON HUNTERS GOLDEN OFFICIAL LYRIC VIDEO</p>
                    </div>
                    <div class="ad-banner">
                        <!-- 실제 서비스용: <img src="/images/ad-banner-3.jpg" alt="광고 3"> -->
                        <img src="https://placehold.co/250x100/45b7d1/ffffff?text=광고+배너+3" alt="광고 3">
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

// DOM 로드 완료 시 지도 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('지도 페이지 DOM 로드됨');
    
    // 이미 초기화되었다면 건너뛰기
    if (window.mapInitialized) {
        console.log('지도가 이미 초기화되었습니다. DOM 로드 이벤트 무시.');
        return;
    }
    
    // Kakao Maps API가 이미 준비된 경우 지도 초기화
    if (typeof kakao !== 'undefined' && kakao.maps && kakao.maps.LatLng && typeof kakao.maps.LatLng === 'function') {
        console.log('DOM 로드 시 Kakao Maps API가 이미 준비됨, 지도 초기화 시작');
        if (typeof initMap === 'function') {
            window.mapInitialized = true; // 플래그 설정
            initMap();
        }
    } else {
        console.log('DOM 로드 시 Kakao Maps API가 아직 준비되지 않음, 대기 중...');
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
