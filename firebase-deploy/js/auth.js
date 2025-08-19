// 인증 페이지 공통 JavaScript

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
        setupSignupValidation();
    }
    
    // 모달 외부 클릭 시 닫기
    setupModalClose();
}

// 로그인 처리
function handleLogin(event) {
    // 기본 유효성 검사
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        event.preventDefault();
        showMessage('이메일과 비밀번호를 모두 입력해주세요.', 'error');
        return;
    }
    
    // 이메일 형식 검사
    if (!isValidEmail(email)) {
        event.preventDefault();
        showMessage('올바른 이메일 형식을 입력해주세요.', 'error');
        return;
    }
    
    // 폼이 유효하면 자동으로 제출됨 (HTML form의 action="/login" method="post" 사용)
    // 로그인 버튼 비활성화
    const loginBtn = event.target.querySelector('button[type="submit"]');
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';
    
    // 3초 후 버튼 복원 (로그인 실패 시를 대비)
    setTimeout(() => {
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 로그인';
    }, 3000);
}

// 회원가입 처리
function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const name = formData.get('name');
    const phone = formData.get('phone');
    const address = formData.get('address');
    const detailAddress = formData.get('detailAddress');
    const agreeTerms = formData.get('agreeTerms');
    const agreePrivacy = formData.get('agreePrivacy');
    const agreeMarketing = formData.get('agreeMarketing');
    
    // 필수 항목 검사
    if (!email || !password || !confirmPassword || !name || !phone || !address) {
        showMessage('필수 항목을 모두 입력해주세요.', 'error');
        return;
    }
    
    // 이메일 인증 확인
    if (!isEmailVerified) {
        showMessage('이메일 인증을 완료해주세요.', 'error');
        return;
    }
    
    // 비밀번호 확인
    if (password !== confirmPassword) {
        showMessage('비밀번호가 일치하지 않습니다.', 'error');
        return;
    }
    
    // 약관 동의 확인
    if (!agreeTerms || !agreePrivacy) {
        showMessage('필수 약관에 동의해주세요.', 'error');
        return;
    }
    
    // 회원가입 버튼 비활성화
    const signupBtn = event.target.querySelector('button[type="submit"]');
    signupBtn.disabled = true;
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 가입 중...';
    
    // 실제 회원가입 API 호출 (임시로 시뮬레이션)
    setTimeout(() => {
        // 여기에 실제 회원가입 API 호출 코드가 들어갑니다
        console.log('회원가입 시도:', {
            email, password, name, phone, address, detailAddress,
            agreeTerms, agreePrivacy, agreeMarketing
        });
        
        // 성공 시 로그인 페이지로 이동
        showMessage('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.', 'success');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
    }, 1000);
}

// 회원가입 유효성 검사 설정
function setupSignupValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const signupBtn = document.getElementById('signupBtn');
    
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePassword);
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
    
    // 전체 폼 유효성 검사
    const form = document.getElementById('signupForm');
    if (form) {
        form.addEventListener('input', () => {
            updateSignupButton();
        });
    }
}

// 이메일 유효성 검사
function validateEmail() {
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showFieldError('email', '올바른 이메일 형식을 입력해주세요.');
        return false;
    }
    
    clearFieldError('email');
    return true;
}

// 비밀번호 유효성 검사
function validatePassword() {
    const password = document.getElementById('password').value;
    const strengthDiv = document.getElementById('passwordStrength');
    
    if (!strengthDiv) return;
    
    let strength = 0;
    let message = '';
    let className = '';
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength < 3) {
        message = '약함';
        className = 'weak';
    } else if (strength < 4) {
        message = '보통';
        className = 'medium';
    } else {
        message = '강함';
        className = 'strong';
    }
    
    strengthDiv.textContent = `비밀번호 강도: ${message}`;
    strengthDiv.className = `password-strength ${className}`;
    
    return strength >= 3;
}

// 비밀번호 일치 검사
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchDiv = document.getElementById('passwordMatch');
    
    if (!matchDiv) return;
    
    if (!confirmPassword) {
        matchDiv.textContent = '';
        matchDiv.className = 'password-match';
        return false;
    }
    
    if (password === confirmPassword) {
        matchDiv.textContent = '비밀번호가 일치합니다.';
        matchDiv.className = 'password-match match';
        return true;
    } else {
        matchDiv.textContent = '비밀번호가 일치하지 않습니다.';
        matchDiv.className = 'password-match mismatch';
        return false;
    }
}

// 회원가입 버튼 상태 업데이트
function updateSignupButton() {
    const signupBtn = document.getElementById('signupBtn');
    if (!signupBtn) return;
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const agreePrivacy = document.getElementById('agreePrivacy').checked;
    
    const isValid = email && password && confirmPassword && name && phone && address && 
                   agreeTerms && agreePrivacy && isEmailVerified && 
                   password === confirmPassword && validatePassword();
    
    signupBtn.disabled = !isValid;
}

// 이메일 인증 관련 변수
let isEmailVerified = false;
let verificationTimer = null;

// 이메일 인증번호 발송
function sendVerificationEmail() {
    const email = document.getElementById('email').value;
    
    if (!email) {
        showMessage('이메일을 먼저 입력해주세요.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('올바른 이메일 형식을 입력해주세요.', 'error');
        return;
    }
    
    // 인증번호 발송 버튼 비활성화
    const sendBtn = document.querySelector('button[onclick="sendVerificationEmail()"]');
    sendBtn.disabled = true;
    sendBtn.textContent = '발송 중...';
    
    // 실제 이메일 인증 API 호출
    fetch('/api/email/send-verification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 인증 그룹 표시
            document.getElementById('verificationGroup').style.display = 'block';
            
            // 인증번호 입력 필드에 포커스
            document.getElementById('verificationCode').focus();
            
            showMessage(data.message, 'success');
            
            // 3분 타이머 시작
            startVerificationTimer();
        } else {
            showMessage(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('인증번호 발송 오류:', error);
        showMessage('인증번호 발송에 실패했습니다. 다시 시도해주세요.', 'error');
    })
    .finally(() => {
        // 인증번호 발송 버튼 복원
        sendBtn.disabled = false;
        sendBtn.textContent = '인증번호 발송';
    });
}

// 이메일 인증번호 확인
function verifyEmail() {
    const email = document.getElementById('email').value;
    const code = document.getElementById('verificationCode').value;
    const statusDiv = document.getElementById('verificationStatus');
    
    if (!code) {
        showMessage('인증번호를 입력해주세요.', 'error');
        return;
    }
    
    // 실제 인증번호 확인 API 호출
    fetch('/api/email/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            email: email,
            code: code 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            isEmailVerified = true;
            statusDiv.textContent = '이메일 인증이 완료되었습니다.';
            statusDiv.className = 'verification-status success';
            
            // 인증번호 입력 필드 비활성화
            document.getElementById('verificationCode').disabled = true;
            document.querySelector('button[onclick="verifyEmail()"]').disabled = true;
            
            // 타이머 정지
            if (verificationTimer) {
                clearInterval(verificationTimer);
            }
            
            showMessage(data.message, 'success');
            
            // 회원가입 버튼 상태 업데이트
            updateSignupButton();
        } else {
            statusDiv.textContent = data.message;
            statusDiv.className = 'verification-status error';
            showMessage(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('인증번호 확인 오류:', error);
        showMessage('인증번호 확인에 실패했습니다. 다시 시도해주세요.', 'error');
    });
}

// 인증 타이머 시작
function startVerificationTimer() {
    let timeLeft = 180; // 3분
    
    verificationTimer = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            clearInterval(verificationTimer);
            isEmailVerified = false;
            
            const statusDiv = document.getElementById('verificationStatus');
            statusDiv.textContent = '인증 시간이 만료되었습니다. 다시 발송해주세요.';
            statusDiv.className = 'verification-status error';
            
            showMessage('인증 시간이 만료되었습니다. 다시 발송해주세요.', 'error');
        }
    }, 1000);
}

// 비밀번호 표시/숨김 토글
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggleBtn = field.nextElementSibling;
    const icon = toggleBtn.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// 주소 검색 (카카오 주소 API 연동)
function searchAddress() {
    // 카카오 주소 검색 API 연동
    if (typeof daum === 'undefined') {
        showMessage('주소 검색 서비스를 불러올 수 없습니다.', 'error');
        return;
    }
    
    new daum.Postcode({
        oncomplete: function(data) {
            document.getElementById('address').value = data.address;
            document.getElementById('detailAddress').focus();
        }
    }).open();
}

// 이용약관 표시
function showTerms() {
    // 관리자 페이지에서 관리되는 이용약관 내용을 가져와서 표시
    fetchTermsContent();
    document.getElementById('termsModal').style.display = 'block';
}

// 개인정보 처리방침 표시
function showPrivacyPolicy() {
    // 관리자 페이지에서 관리되는 개인정보 처리방침 내용을 가져와서 표시
    fetchPrivacyContent();
    document.getElementById('privacyModal').style.display = 'block';
}

// 이용약관 내용 가져오기
function fetchTermsContent() {
    const contentDiv = document.getElementById('termsContent');
    contentDiv.innerHTML = '<p>이용약관 내용을 불러오는 중입니다...</p>';
    
    // 실제로는 관리자 페이지 API에서 내용을 가져옵니다
    // 임시로 샘플 내용을 표시
    setTimeout(() => {
        contentDiv.innerHTML = `
            <h4>제1조 (목적)</h4>
            <p>이 약관은 모두의 모델하우스(이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 이용자와의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
            
            <h4>제2조 (정의)</h4>
            <p>1. "서비스"라 함은 회사가 제공하는 모든 서비스를 의미합니다.<br>
            2. "이용자"라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 의미합니다.</p>
            
            <h4>제3조 (약관의 효력 및 변경)</h4>
            <p>1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.<br>
            2. 회사는 필요한 경우 관련법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.</p>
        `;
    }, 500);
}

// 개인정보 처리방침 내용 가져오기
function fetchPrivacyContent() {
    const contentDiv = document.getElementById('privacyContent');
    contentDiv.innerHTML = '<p>개인정보 처리방침 내용을 불러오는 중입니다...</p>';
    
    // 실제로는 관리자 페이지 API에서 내용을 가져옵니다
    // 임시로 샘플 내용을 표시
    setTimeout(() => {
        contentDiv.innerHTML = `
            <h4>1. 개인정보의 처리 목적</h4>
            <p>회사는 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의 목적 이외의 용도로는 이용하지 않습니다.<br>
            - 회원가입 및 관리<br>
            - 서비스 제공 및 운영<br>
            - 고객상담 및 문의응답</p>
            
            <h4>2. 개인정보의 처리 및 보유기간</h4>
            <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
            
            <h4>3. 개인정보의 제3자 제공</h4>
            <p>회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
            
            <h4>4. 정보주체의 권리·의무 및 그 행사방법</h4>
            <p>이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.<br>
            - 개인정보 열람요구<br>
            - 오류 등이 있을 경우 정정 요구<br>
            - 삭제요구<br>
            - 처리정지 요구</p>
        `;
    }, 500);
}

// 모달 닫기
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 모달 외부 클릭 시 닫기 설정
function setupModalClose() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// 유틸리티 함수들
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type = 'info') {
    // 기존 메시지 제거
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 새 메시지 생성
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    messageDiv.innerHTML = `${icon} ${message}`;
    
    // 페이지에 추가
    document.body.appendChild(messageDiv);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const inputGroup = field.closest('.input-group');
    
    // 기존 오류 메시지 제거
    const existingError = inputGroup.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // 오류 메시지 추가
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '5px';
    
    inputGroup.parentNode.appendChild(errorDiv);
    
    // 입력 필드에 오류 스타일 적용
    inputGroup.style.borderColor = '#dc3545';
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const inputGroup = field.closest('.input-group');
    
    // 오류 메시지 제거
    const existingError = inputGroup.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // 입력 필드 오류 스타일 제거
    inputGroup.style.borderColor = '#e1e8ed';
}
