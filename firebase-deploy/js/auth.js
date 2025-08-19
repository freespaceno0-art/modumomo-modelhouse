// Firebase Hosting용 간단한 인증 JavaScript

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

// 인증 페이지 초기화
function initializeAuth() {
    // 로그인 폼 이벤트 리스너
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 회원가입 폼 이벤트 리스너
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // 비밀번호 표시/숨김 토글
    setupPasswordToggle();
}

// 로그인 처리
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showMessage('이메일과 비밀번호를 모두 입력해주세요.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('올바른 이메일 형식을 입력해주세요.', 'error');
        return;
    }
    
    // 로그인 버튼 비활성화
    const loginBtn = event.target.querySelector('button[type="submit"]');
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';
    
    // 간단한 로그인 시뮬레이션 (실제로는 서버와 통신)
    setTimeout(() => {
        // 테스트 계정 확인
        if (email === 'admin@test.com' && password === 'admin123') {
            const userData = {
                email: email,
                role: 'ROLE_ADMIN',
                username: 'admin'
            };
            
            // localStorage에 로그인 데이터 저장
            localStorage.setItem('loginData', JSON.stringify(userData));
            
            showMessage('로그인에 성공했습니다!', 'success');
            
            // 메인 페이지로 리다이렉트
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showMessage('이메일 또는 비밀번호가 올바르지 않습니다.', 'error');
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 로그인';
        }
    }, 1500);
}

// 회원가입 처리
function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('fullName').value;
    
    if (!username || !email || !password || !fullName) {
        showMessage('모든 필수 항목을 입력해주세요.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('올바른 이메일 형식을 입력해주세요.', 'error');
        return;
    }
    
    if (password.length < 8) {
        showMessage('비밀번호는 8자 이상 입력해주세요.', 'error');
        return;
    }
    
    // 회원가입 버튼 비활성화
    const signupBtn = event.target.querySelector('button[type="submit"]');
    signupBtn.disabled = true;
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 가입 중...';
    
    // 간단한 회원가입 시뮬레이션
    setTimeout(() => {
        showMessage('회원가입이 완료되었습니다! 로그인해주세요.', 'success');
        
        // 로그인 페이지로 리다이렉트
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }, 1500);
}

// 비밀번호 표시/숨김 토글
function setupPasswordToggle() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 메시지 표시
function showMessage(message, type = 'info') {
    // 기존 메시지 제거
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 새 메시지 생성
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message auth-message-${type}`;
    messageDiv.textContent = message;
    
    // 스타일 적용
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideDown 0.3s ease;
    `;
    
    // 타입별 색상
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#4caf50';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#f44336';
    } else {
        messageDiv.style.backgroundColor = '#2196f3';
    }
    
    // 페이지에 추가
    document.body.appendChild(messageDiv);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
