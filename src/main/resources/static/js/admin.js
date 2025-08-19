// Admin Page JavaScript
// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('관리자 페이지 로드됨');
    
    // 탭 설정
    setupTabs();
    
    // 기본 탭 활성화
    document.querySelector('.nav-tab[data-tab="member-tab"]').click();
    
    // 폼 이벤트 리스너 설정
    setupFormListeners();
    
    // 이미지 업로드 기능 설정
    setupImageUpload();
    
    // 잔여일 계산 및 경고 표시
    calculateRemainingDays();
    
    // Kakao Maps API 로딩 상태 확인 및 지속적 모니터링
    checkKakaoMapsAPI();
    
    // API 상태를 지속적으로 모니터링 (5초마다)
    setInterval(() => {
        if (typeof kakao !== 'undefined' && kakao.maps && kakao.maps.services) {
            console.log('🔄 Kakao Maps API 상태 확인 중...');
        }
    }, 5000);
});

// Kakao Maps API 로딩 상태 확인
function checkKakaoMapsAPI() {
    // 더 안정적인 API 로딩 확인
    const checkKakaoAPI = () => {
        return typeof kakao !== 'undefined' && 
               kakao.maps && 
               kakao.maps.services && 
               typeof kakao.maps.services.Geocoder === 'function';
    };
    
    if (checkKakaoAPI()) {
        console.log('✅ Kakao Maps API 로딩 완료 - 주소 검색 기능 사용 가능');
        return true;
    } else {
        console.log('⏳ Kakao Maps API 로딩 대기 중...');
        
        // API 로딩 대기 (더 자주 체크)
        const checkKakao = setInterval(function() {
            if (checkKakaoAPI()) {
                clearInterval(checkKakao);
                console.log('✅ Kakao Maps API 로딩 완료 - 주소 검색 기능 사용 가능');
            }
        }, 50); // 50ms마다 체크
        
        // 15초 후 타임아웃
        setTimeout(() => {
            if (checkKakao) {
                clearInterval(checkKakao);
                console.warn('⚠️ Kakao Maps API 로딩 타임아웃 - 주소 검색 기능이 제한될 수 있습니다');
                
                // 사용자에게 알림
                showMessage('지도 API 로딩에 실패했습니다. 주소 검색 기능이 제한될 수 있습니다.', 'warning');
            }
        }, 15000);
        
        return false;
    }
}

// 탭 전환 기능
function setupTabs() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            const targetTabElement = document.getElementById(targetTab);
            
            // 대상 탭이 존재하는지 확인
            if (!targetTabElement) {
                console.error(`Target tab not found: ${targetTab}`);
                return;
            }
            
            // 모든 탭 비활성화
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 선택된 탭 활성화
            this.classList.add('active');
            targetTabElement.classList.add('active');
        });
    });
}

// 폼 이벤트 리스너 설정
function setupFormListeners() {
    // 모델하우스 폼
    const houseForm = document.getElementById('houseForm');
    if (houseForm) {
        houseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveHouse();
        });
    }
    
    // 개인정보 처리방침 폼
    const privacyForm = document.getElementById('privacyForm');
    if (privacyForm) {
        privacyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePrivacy();
        });
    }
}

// 이미지 업로드 기능
function setupImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    if (!imageUpload) return;
    
    imageUpload.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        const imagePreview = document.getElementById('imagePreview');
        
        if (files.length > 15) {
            alert('이미지는 최대 15개까지 업로드 가능합니다.');
            return;
        }
        
        imagePreview.innerHTML = '';
        
        files.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageItem = document.createElement('div');
                    imageItem.className = 'image-item';
                    imageItem.innerHTML = `
                        <img src="${e.target.result}" alt="Preview ${index + 1}">
                        <button type="button" class="image-remove" onclick="removeImage(this)">×</button>
                    `;
                    imagePreview.appendChild(imageItem);
                };
                reader.readAsDataURL(file);
            }
        });
    });
}

// 주소 검색 및 위도/경도 자동 설정
function searchAddress() {
    const address = document.getElementById('houseAddress').value;
    if (!address.trim()) {
        alert('주소를 입력해주세요.');
        return;
    }

    // Kakao Maps API가 로드되었는지 확인하고 로드되지 않았다면 대기
    const checkKakaoAPI = () => {
        return typeof kakao !== 'undefined' && 
               kakao.maps && 
               kakao.maps.services && 
               typeof kakao.maps.services.Geocoder === 'function';
    };
    
    if (!checkKakaoAPI()) {
        console.log('Kakao Maps API 로딩 대기 중...');
        
        // API 로딩 대기 (더 자주 체크)
        const checkKakao = setInterval(function() {
            if (checkKakaoAPI()) {
                clearInterval(checkKakao);
                console.log('Kakao Maps API 로딩 완료, 주소 검색 시작');
                searchAddressWithKakao(address);
            }
        }, 50); // 50ms마다 체크
        
        // 15초 후 타임아웃
        setTimeout(() => {
            if (checkKakao) {
                clearInterval(checkKakao);
                showMessage('지도 API 로딩에 실패했습니다. 페이지를 새로고침하고 다시 시도해주세요.', 'error');
                console.error('Kakao Maps API 로딩 타임아웃');
            }
        }, 15000);
        
        return;
    }
    
    // API가 이미 로드된 경우 바로 검색
    searchAddressWithKakao(address);
}

// Kakao Maps API를 사용한 실제 주소 검색
function searchAddressWithKakao(address) {
    try {
        // 더 안전한 API 상태 확인
        const checkKakaoAPI = () => {
            return typeof kakao !== 'undefined' && 
                   kakao.maps && 
                   kakao.maps.services && 
                   typeof kakao.maps.services.Geocoder === 'function';
        };
        
        if (!checkKakaoAPI()) {
            throw new Error('Kakao Maps services가 아직 초기화되지 않았습니다.');
        }
        
        const geocoder = new kakao.maps.services.Geocoder();
        
        geocoder.addressSearch(address, function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                
                // 위도/경도 정보를 숨겨진 필드에 저장
                if (!window.houseCoordinates) {
                    window.houseCoordinates = {};
                }
                window.houseCoordinates.latitude = coords.getLat();
                window.houseCoordinates.longitude = coords.getLng();
                
                // 주소 결과 표시
                const addressResult = document.getElementById('addressResult');
                const addressText = document.getElementById('addressText');
                addressText.textContent = `✅ 주소 확인됨: ${result[0].address.address_name}`;
                addressResult.style.display = 'block';
                addressResult.style.background = '#d4edda';
                addressResult.style.color = '#155724';
                addressResult.style.border = '1px solid #c3e6cb';
                
                console.log('주소 검색 성공:', {
                    address: result[0].address.address_name,
                    latitude: coords.getLat(),
                    longitude: coords.getLng()
                });
            } else {
                // 주소 검색 실패
                const addressResult = document.getElementById('addressResult');
                const addressText = document.getElementById('addressText');
                addressText.textContent = `❌ 주소를 찾을 수 없습니다. 정확한 주소를 입력해주세요.`;
                addressResult.style.display = 'block';
                addressResult.style.background = '#f8d7da';
                addressResult.style.color = '#721c24';
                addressResult.style.border = '1px solid #f5c6cb';
                
                // 기존 좌표 정보 제거
                if (window.houseCoordinates) {
                    delete window.houseCoordinates.latitude;
                    delete window.houseCoordinates.longitude;
                }
                
                console.error('주소 검색 실패:', status);
            }
        });
    } catch (error) {
        console.error('주소 검색 중 오류 발생:', error);
        
        // services가 초기화되지 않은 경우 대기 후 재시도
        if (error.message.includes('services가 아직 초기화되지 않았습니다')) {
            console.log('services 초기화 대기 중, 1초 후 재시도...');
            setTimeout(() => {
                searchAddressWithKakao(address);
            }, 1000);
            return;
        }
        
        showMessage('주소 검색 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    }
}

// 타입/분양가 추가
function addTypePrice() {
    const container = document.getElementById('typePriceContainer');
    const items = container.querySelectorAll('.type-price-item');
    
    if (items.length >= 5) {
        alert('타입과 분양가는 최대 5개까지 추가 가능합니다.');
        return;
    }
    
    const newItem = document.createElement('div');
    newItem.className = 'type-price-item';
    newItem.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: center;">
            <input type="number" class="form-input" name="houseType[]" placeholder="타입 (예: 3)" min="1" max="999" required style="flex: 1;">
            <input type="text" class="form-input" name="housePrice[]" placeholder="분양가 (예: 5억원)" required style="flex: 1;">
            <button type="button" class="btn btn-danger" onclick="removeTypePrice(this)" style="flex: 0 0 auto;">×</button>
        </div>
    `;
    
    container.appendChild(newItem);
    
    // 5개가 되면 추가 버튼 비활성화
    if (items.length + 1 >= 5) {
        document.getElementById('addTypePriceBtn').disabled = true;
    }
}

// 타입/분양가 제거
function removeTypePrice(button) {
    button.closest('.type-price-item').remove();
    
    // 5개 미만이 되면 추가 버튼 활성화
    const items = document.querySelectorAll('.type-price-item');
    if (items.length < 5) {
        document.getElementById('addTypePriceBtn').disabled = false;
    }
}

// 이미지 제거
function removeImage(button) {
    button.parentElement.remove();
}

// 지도 페이지로 이동하여 해당 마커로 이동
function goToMap(modelId, houseName, lat, lng) {
    // 지도 페이지로 이동하면서 모델하우스 정보를 URL 파라미터로 전달
    const mapUrl = `/map?modelId=${modelId}&lat=${lat}&lng=${lng}&houseName=${encodeURIComponent(houseName)}`;
    window.open(mapUrl, '_blank'); // 새 탭에서 열기
}

// 링크 추가
function addLink() {
    const linkContainer = document.getElementById('linkContainer');
    const linkInputs = linkContainer.querySelectorAll('.link-inputs');
    
    if (linkInputs.length >= 6) {
        alert('링크는 최대 6개까지 추가 가능합니다.');
        return;
    }
    
    const newLink = document.createElement('div');
    newLink.className = 'link-inputs';
    newLink.innerHTML = `
        <div class="link-item">
            <input type="url" class="form-input" placeholder="URL을 입력하세요" name="linkUrl[]" required>
            <button type="button" class="link-remove" onclick="removeLink(this)">×</button>
        </div>
    `;
    
    linkContainer.appendChild(newLink);
    
    // 링크가 6개가 되면 추가 버튼 비활성화
    if (linkInputs.length + 1 >= 6) {
        document.getElementById('addLinkBtn').disabled = true;
    }
}

// 링크 제거
function removeLink(button) {
    button.closest('.link-inputs').remove();
    
    // 링크가 6개 미만이 되면 추가 버튼 활성화
    const linkInputs = document.querySelectorAll('.link-inputs');
    if (linkInputs.length < 6) {
        document.getElementById('addLinkBtn').disabled = false;
    }
}

// 모델하우스 저장
function saveHouse() {
    const formData = new FormData();
    
    // 기본 정보
    formData.append('name', document.getElementById('houseName').value);
    formData.append('address', document.getElementById('houseAddress').value);
    formData.append('phone', document.getElementById('housePhone').value);
    formData.append('category', document.getElementById('houseCategory').value);
    
    // 위도/경도는 주소 검색으로 자동 설정된 값 사용
    if (window.houseCoordinates && window.houseCoordinates.latitude && window.houseCoordinates.longitude) {
        formData.append('latitude', window.houseCoordinates.latitude);
        formData.append('longitude', window.houseCoordinates.longitude);
    } else {
        alert('주소를 검색하여 위치를 확인해주세요.');
        return;
    }
    
    formData.append('registrationDays', document.getElementById('registrationDays').value);
    
    // 타입 및 분양가 정보
    const typePriceItems = document.querySelectorAll('.type-price-item');
    const types = [];
    const prices = [];
    
    typePriceItems.forEach(item => {
        const type = item.querySelector('input[name="houseType[]"]').value;
        const price = item.querySelector('input[name="housePrice[]"]').value;
        
        if (type && price) {
            types.push(type);
            prices.push(price);
        }
    });
    
    if (types.length === 0) {
        alert('최소 하나의 타입과 분양가를 입력해주세요.');
        return;
    }
    
    formData.append('types', JSON.stringify(types));
    formData.append('prices', JSON.stringify(prices));
    
    // 이미지 파일들
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload.files.length > 0) {
        for (let i = 0; i < imageUpload.files.length; i++) {
            formData.append('images', imageUpload.files[i]);
        }
    }
    
    // 링크 정보
    const linkUrls = document.querySelectorAll('input[name="linkUrl[]"]');
    const links = [];
    
    for (let i = 0; i < linkUrls.length; i++) {
        if (linkUrls[i].value) {
            links.push({
                url: linkUrls[i].value
            });
        }
    }
    
    formData.append('links', JSON.stringify(links));
    
    // 등록 기간 유효성 검사
    const days = parseInt(document.getElementById('registrationDays').value);
    if (days < 1 || days > 999) {
        alert('등록 기간은 1일에서 999일 사이로 설정해주세요.');
        return;
    }
    
    // API 호출 (실제 구현 시)
    console.log('모델하우스 저장:', Object.fromEntries(formData));
    
    // 새로운 모델하우스를 목록에 추가
    addHouseToList({
        id: Date.now(), // 임시 ID (실제로는 서버에서 받아야 함)
        name: document.getElementById('houseName').value,
        address: document.getElementById('houseAddress').value,
        phone: document.getElementById('housePhone').value,
        category: document.getElementById('houseCategory').value,
        type: types[0] + '타입',
        price: prices[0],
        registrationDays: days
    });
    
    // 성공 메시지 표시
    showMessage('모델하우스가 성공적으로 저장되었습니다.', 'success');
    
    // 폼 초기화
    resetForm();
}

// 모델하우스를 목록에 추가하는 함수
function addHouseToList(houseData) {
    const houseList = document.querySelector('.house-list');
    const houseItem = document.createElement('div');
    houseItem.className = 'house-item';
    
    // 현재 날짜로부터 등록 기간 계산
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + houseData.registrationDays);
    const endDateStr = endDate.toISOString().split('T')[0];
    
    houseItem.innerHTML = `
        <div class="house-info">
            <div class="house-name">${houseData.name}</div>
            <div class="house-address">${houseData.address}</div>
            <div class="house-details">
                <span class="house-category">${houseData.category}</span>
                <span class="house-type">${houseData.type}</span>
                <span class="house-price">${houseData.price}</span>
                <span class="remaining-days" data-end-date="${endDateStr}">잔여 ${houseData.registrationDays}일</span>
            </div>
            <div class="house-status" style="margin-top: 0.5rem;">
                <span class="status-badge active">활성</span>
                <span class="house-phone">${houseData.phone}</span>
            </div>
        </div>
        <div class="house-actions">
            <button class="btn btn-primary" onclick="editHouse(${houseData.id})">
                <i class="fas fa-edit"></i> 수정
            </button>
            <button class="btn btn-danger" onclick="removeHouse(${houseData.id})">
                <i class="fas fa-trash"></i> 삭제
            </button>
            <button class="btn btn-info" onclick="goToMap(${houseData.id}, '${houseData.name}', ${window.houseCoordinates.latitude}, ${window.houseCoordinates.longitude})">
                <i class="fas fa-map-marker-alt"></i> 지도에서 보기
            </button>
            <div class="extend-section">
                <input type="number" class="extend-days" id="extendDays${houseData.id}" placeholder="연장일수" min="1" max="999" style="width: 80px;">
                <button class="btn btn-success" onclick="extendHouse(${houseData.id})">
                    <i class="fas fa-calendar-plus"></i> 연장
                </button>
            </div>
        </div>
    `;
    
    // 목록의 맨 위에 추가
    houseList.insertBefore(houseItem, houseList.firstChild.nextSibling);
    
    // 잔여일 계산 및 경고 표시 업데이트
    calculateRemainingDays();
}

// 개인정보 처리방침 저장
function savePrivacy() {
    const privacyData = {
        purpose: document.getElementById('privacyPurpose').value,
        items: document.getElementById('privacyItems').value,
        retention: document.getElementById('privacyRetention').value,
        thirdParty: document.getElementById('privacyThirdParty').value
    };
    
    // API 호출 (실제 구현 시)
    console.log('개인정보 처리방침 저장:', privacyData);
    
    // 성공 메시지 표시
    showMessage('개인정보 처리방침이 성공적으로 저장되었습니다.', 'success');
}

// 폼 초기화
function resetForm() {
    document.getElementById('houseForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    
    // 등록 기간 기본값 설정
    document.getElementById('registrationDays').value = '1';
    
    // 카테고리 초기화
    document.getElementById('houseCategory').value = '';
    
    // 위도/경도 정보 초기화
    if (window.houseCoordinates) {
        delete window.houseCoordinates.latitude;
        delete window.houseCoordinates.longitude;
    }
    
    // 주소 결과 숨기기
    const addressResult = document.getElementById('addressResult');
    if (addressResult) {
        addressResult.style.display = 'none';
    }
    
         // 타입/분양가 초기화
     const typePriceContainer = document.getElementById('typePriceContainer');
     typePriceContainer.innerHTML = `
         <div class="type-price-item">
             <div style="display: flex; gap: 1rem; align-items: center;">
                 <input type="number" class="form-input" name="houseType[]" placeholder="타입 (예: 3)" min="1" max="999" required style="flex: 1;">
                 <input type="text" class="form-input" name="housePrice[]" placeholder="분양가 (예: 5억원)" required style="flex: 1;">
                 <button type="button" class="btn btn-danger" onclick="removeTypePrice(this)" style="flex: 0 0 auto;">×</button>
             </div>
         </div>
     `;
    
    // 링크 초기화
    const linkContainer = document.getElementById('linkContainer');
    linkContainer.innerHTML = `
        <div class="link-inputs">
            <div class="link-item">
                <input type="url" class="form-input" placeholder="URL을 입력하세요" name="linkUrl[]" required>
                <button type="button" class="link-remove" onclick="removeLink(this)">×</button>
            </div>
        </div>
    `;
    
    // 링크 추가 버튼 활성화
    document.getElementById('addLinkBtn').disabled = false;
    
    // 타입/분양가 추가 버튼 활성화
    document.getElementById('addTypePriceBtn').disabled = false;
}

// 회원 탈퇴
function removeMember(memberId) {
    const memberItem = document.querySelector(`[onclick*="removeMember(${memberId}"]`).closest('.member-item');
    const memberName = memberItem.querySelector('.member-name').textContent;
    
    if (confirm(`정말로 ${memberName} 회원을 탈퇴시키시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
        // 실제로는 서버에 API 호출
        console.log(`회원 ${memberId} 탈퇴 처리`);
        
        // UI에서 제거
        memberItem.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            memberItem.remove();
            showMessage(`${memberName} 회원이 탈퇴되었습니다.`, 'success');
        }, 500);
    }
}

// 회원 목록 새로고침
function refreshMembers() {
    // API 호출하여 최신 회원 목록 가져오기 (실제 구현 시)
    console.log('회원 목록 새로고침');
    
    showMessage('회원 목록이 새로고침되었습니다.', 'success');
}

// 모델하우스 수정
function editHouse(houseId) {
    const houseItem = document.querySelector(`[onclick*="editHouse(${houseId}"]`).closest('.house-item');
    const houseName = houseItem.querySelector('.house-name').textContent;
    const houseAddress = houseItem.querySelector('.house-address').textContent;
    const housePhone = houseItem.querySelector('.house-phone').textContent;
    const houseCategory = houseItem.querySelector('.house-category').textContent;
    
    // 폼에 데이터 채우기
    document.getElementById('houseName').value = houseName;
    document.getElementById('houseAddress').value = houseAddress;
    document.getElementById('housePhone').value = housePhone;
    document.getElementById('houseCategory').value = houseCategory;
    
    // 모델하우스 관리 탭으로 이동
    document.querySelector('.nav-tab[data-tab="modelhouse-tab"]').click();
    
    // 폼 제출 버튼 텍스트 변경
    const submitBtn = document.querySelector('#houseForm button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> 수정';
    submitBtn.onclick = function(e) {
        e.preventDefault();
        updateHouse(houseId);
    };
    
    showMessage(`${houseName} 모델하우스 정보를 수정할 수 있습니다.`, 'info');
}

// 모델하우스 수정 처리
function updateHouse(houseId) {
    const houseName = document.getElementById('houseName').value;
    const houseAddress = document.getElementById('houseAddress').value;
    const housePhone = document.getElementById('housePhone').value;
    const houseCategory = document.getElementById('houseCategory').value;
    
    if (!houseName || !houseAddress || !housePhone || !houseCategory) {
        showMessage('모든 필수 항목을 입력해주세요.', 'error');
        return;
    }
    
    // 실제로는 서버에 API 호출
    console.log(`모델하우스 ${houseId} 수정:`, { houseName, houseAddress, housePhone, houseCategory });
    
    // UI 업데이트
    const houseItem = document.querySelector(`[onclick*="editHouse(${houseId}"]`).closest('.house-item');
    houseItem.querySelector('.house-name').textContent = houseName;
    houseItem.querySelector('.house-address').textContent = houseAddress;
    houseItem.querySelector('.house-phone').textContent = housePhone;
    houseItem.querySelector('.house-category').textContent = houseCategory;
    
    // 폼 초기화
    resetForm();
    
    showMessage(`${houseName} 모델하우스가 수정되었습니다.`, 'success');
}

// 모델하우스 삭제
function removeHouse(houseId) {
    const houseItem = document.querySelector(`[onclick*="removeHouse(${houseId}"]`).closest('.house-item');
    const houseName = houseItem.querySelector('.house-name').textContent;
    
    if (confirm(`정말로 ${houseName} 모델하우스를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
        // 실제로는 서버에 API 호출
        console.log(`모델하우스 ${houseId} 삭제 처리`);
        
        // UI에서 제거
        houseItem.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            houseItem.remove();
            showMessage(`${houseName} 모델하우스가 삭제되었습니다.`, 'success');
        }, 500);
    }
}

// 모델하우스 연장
function extendHouse(houseId) {
    const extendDaysInput = document.getElementById(`extendDays${houseId}`);
    const extendDays = parseInt(extendDaysInput.value);
    
    if (!extendDays || extendDays < 1 || extendDays > 999) {
        showMessage('1일에서 999일 사이의 연장일수를 입력해주세요.', 'error');
        return;
    }
    
    const houseItem = document.querySelector(`[onclick*="extendHouse(${houseId}"]`).closest('.house-item');
    const houseName = houseItem.querySelector('.house-name').textContent;
    const remainingDaysElement = houseItem.querySelector('.remaining-days');
    
    // 실제로는 서버에 API 호출
    console.log(`모델하우스 ${houseId} 연장: ${extendDays}일`);
    
    // UI 업데이트 (안전한 방식으로)
    const currentText = remainingDaysElement.textContent;
    const matchResult = currentText.match(/\d+/);
    
    if (matchResult && matchResult[0]) {
        const currentDays = parseInt(matchResult[0]);
        const newDays = currentDays + extendDays;
        remainingDaysElement.textContent = `잔여 ${newDays}일`;
        
        // 연장일수 입력 필드 초기화
        extendDaysInput.value = '';
        
        showMessage(`${houseName} 모델하우스가 ${extendDays}일 연장되었습니다.`, 'success');
    } else {
        // 숫자를 찾을 수 없는 경우 기본값으로 설정
        remainingDaysElement.textContent = `잔여 ${extendDays}일`;
        extendDaysInput.value = '';
        showMessage(`${houseName} 모델하우스가 ${extendDays}일 연장되었습니다.`, 'success');
    }
}

// 모델하우스 검색
function searchHouses() {
    const searchTerm = document.getElementById('houseSearchInput').value.toLowerCase().trim();
    const houseItems = document.querySelectorAll('.house-item');
    
    if (!searchTerm) {
        // 검색어가 없으면 모든 항목 표시
        houseItems.forEach(item => {
            item.style.display = 'block';
        });
        return;
    }
    
    houseItems.forEach(item => {
        const houseName = item.querySelector('.house-name').textContent.toLowerCase();
        const houseAddress = item.querySelector('.house-address').textContent.toLowerCase();
        const houseType = item.querySelector('.house-type').textContent.toLowerCase();
        
        if (houseName.includes(searchTerm) || 
            houseAddress.includes(searchTerm) || 
            houseType.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    // 검색 결과가 없을 때 메시지 표시
    const visibleItems = Array.from(houseItems).filter(item => item.style.display !== 'none');
    if (visibleItems.length === 0) {
        showMessage('검색 결과가 없습니다.', 'info');
    } else {
        showMessage(`${visibleItems.length}개의 모델하우스를 찾았습니다.`, 'success');
    }
}

// 사용자 검색
function searchUsers() {
    const searchTerm = document.getElementById('userSearchInput').value.toLowerCase().trim();
    const userItems = document.querySelectorAll('.member-item');
    
    if (!searchTerm) {
        // 검색어가 없으면 모든 항목 표시
        userItems.forEach(item => {
            item.style.display = 'block';
        });
        return;
    }
    
    userItems.forEach(item => {
        const userName = item.querySelector('.member-name').textContent.toLowerCase();
        const userEmail = item.querySelector('.member-email').textContent.toLowerCase();
        
        if (userName.includes(searchTerm) || 
            userEmail.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    // 검색 결과가 없을 때 메시지 표시
    const visibleItems = Array.from(userItems).filter(item => item.style.display !== 'none');
    if (visibleItems.length === 0) {
        showMessage('검색 결과가 없습니다.', 'info');
    } else {
        showMessage(`${visibleItems.length}명의 사용자를 찾았습니다.`, 'success');
    }
}

// 회원 역할 변경
function changeRole(memberId, newRole) {
    const roleText = newRole === 'ADMIN' ? '관리자' : '일반회원';
    const confirmMessage = `정말로 이 회원을 ${roleText}로 변경하시겠습니까?`;
    
    if (confirm(confirmMessage)) {
        // 실제로는 서버에 API 호출
        console.log(`회원 ${memberId}의 역할을 ${newRole}로 변경`);
        
        // UI 업데이트
        const memberItem = document.querySelector(`[onclick*="changeRole(${memberId}"]`).closest('.member-item');
        const roleElement = memberItem.querySelector('.member-role');
        const actionsDiv = memberItem.querySelector('.member-actions');
        
        if (newRole === 'ADMIN') {
            roleElement.textContent = '관리자';
            roleElement.style.color = '#26a69a';
            roleElement.style.fontWeight = '600';
            
            // 버튼 변경
            actionsDiv.innerHTML = `
                <button class="btn btn-secondary" onclick="changeRole(${memberId}, 'USER')">
                    <i class="fas fa-user"></i> 일반회원으로 변경
                </button>
                <button class="btn btn-danger" onclick="removeMember(${memberId})" disabled>
                    <i class="fas fa-user-times"></i> 탈퇴
                </button>
            `;
        } else {
            roleElement.textContent = '일반회원';
            roleElement.style.color = '#7f8c8d';
            roleElement.style.fontWeight = 'normal';
            
            // 버튼 변경
            actionsDiv.innerHTML = `
                <button class="btn btn-primary" onclick="changeRole(${memberId}, 'ADMIN')">
                    <i class="fas fa-user-shield"></i> 관리자로 승격
                </button>
                <button class="btn btn-danger" onclick="removeMember(${memberId})">
                    <i class="fas fa-user-times"></i> 탈퇴
                </button>
            `;
        }
        
        showMessage(`회원의 역할이 ${roleText}로 변경되었습니다.`, 'success');
    }
}

// 메시지 표시
function showMessage(message, type = 'info') {
    // 기존 메시지 제거
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    // 타입에 따른 스타일 클래스
    let styleClass = 'info';
    if (type === 'error') styleClass = 'error';
    else if (type === 'success') styleClass = 'success';
    
    messageDiv.innerHTML = `
        <div class="message-content ${styleClass}">
            <span class="message-text">${message}</span>
            <button type="button" class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // 페이지 상단에 메시지 추가
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // 5초 후 자동 제거
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    // Ctrl + S: 저장
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab.id === 'modelhouse-tab') {
            document.getElementById('houseForm').dispatchEvent(new Event('submit'));
        } else if (activeTab.id === 'privacy') {
            document.getElementById('privacyForm').dispatchEvent(new Event('submit'));
        }
    }
    
    // Esc: 폼 초기화
    if (e.key === 'Escape') {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab.id === 'modelhouse-tab') {
            resetForm();
        }
    }
});

// 잔여일 계산 및 경고 표시
function calculateRemainingDays() {
    const remainingDaysElements = document.querySelectorAll('.remaining-days');
    
    remainingDaysElements.forEach(element => {
        const endDate = element.getAttribute('data-end-date');
        if (endDate) {
            const end = new Date(endDate);
            const today = new Date();
            const remainingDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
            
            if (remainingDays > 0) {
                element.textContent = `잔여 ${remainingDays}일`;
                
                // 5일 이하일 경우 경고 스타일 적용
                if (remainingDays <= 5) {
                    element.classList.add('warning');
                    element.closest('.house-item').classList.add('warning');
                } else {
                    element.classList.remove('warning');
                    element.closest('.house-item').classList.remove('warning');
                }
            } else {
                element.textContent = '만료됨';
                element.style.color = '#e74c3c';
                element.style.fontWeight = 'bold';
            }
        }
    });
}
