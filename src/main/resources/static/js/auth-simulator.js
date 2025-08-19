// Firebase Hosting용 인증 상태 시뮬레이터
// 실제 서비스에서는 서버 사이드 인증을 사용해야 합니다

// 로그인 함수
function simulateLogin(username, isAdmin = false) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('isAdmin', isAdmin.toString());
    
    // 페이지 새로고침하여 버튼 상태 업데이트
    location.reload();
}

// 로그아웃 함수
function simulateLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    
    // 페이지 새로고침하여 버튼 상태 업데이트
    location.reload();
}

// 현재 인증 상태 확인
function getCurrentAuthStatus() {
    return {
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        username: localStorage.getItem('username') || '사용자',
        isAdmin: localStorage.getItem('isAdmin') === 'true'
    };
}

// 개발용 테스트 함수들
function testGuestMode() {
    simulateLogout();
}

function testUserMode() {
    simulateLogin('테스트사용자', false);
}

function testAdminMode() {
    simulateLogin('관리자', true);
}

// 페이지 로드 시 인증 상태 확인
document.addEventListener('DOMContentLoaded', function() {
    console.log('인증 상태:', getCurrentAuthStatus());
    
    // 개발용 테스트 버튼 추가 (실제 서비스에서는 제거)
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('firebase')) {
        addTestButtons();
    }
});

// 개발용 테스트 버튼 추가
function addTestButtons() {
    const testContainer = document.createElement('div');
    testContainer.style.cssText = 'position: fixed; top: 10px; left: 10px; z-index: 9999; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; font-size: 12px;';
    testContainer.innerHTML = `
        <div style="margin-bottom: 10px;"><strong>개발용 테스트</strong></div>
        <button onclick="testGuestMode()" style="margin: 2px; padding: 5px; font-size: 10px;">게스트 모드</button>
        <button onclick="testUserMode()" style="margin: 2px; padding: 5px; font-size: 10px;">사용자 모드</button>
        <button onclick="testAdminMode()" style="margin: 2px; padding: 5px; font-size: 10px;">관리자 모드</button>
        <button onclick="this.parentElement.remove()" style="margin: 2px; padding: 5px; font-size: 10px; background: red;">닫기</button>
    `;
    document.body.appendChild(testContainer);
}
