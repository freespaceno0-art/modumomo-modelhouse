// 마커 이미지 생성 및 다운로드
function createMarkerImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 40;
    canvas.height = 50;
    
    // 그림자 효과
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    
    // 그라데이션 배경 (밝은 청록색/터키스)
    const gradient = ctx.createLinearGradient(0, 0, 40, 50);
    gradient.addColorStop(0, '#00bcd4');    // 밝은 청록색
    gradient.addColorStop(0.5, '#00acc1');  // 중간 청록색
    gradient.addColorStop(1, '#0097a7');    // 진한 청록색
    
    // 핀/물방울 모양 그리기
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(20, 0);   // 상단 정점
    ctx.lineTo(33, 32);  // 우측 하단
    ctx.lineTo(20, 28);  // 우측 내부
    ctx.lineTo(7, 32);   // 좌측 하단
    ctx.lineTo(20, 0);   // 상단으로 닫기
    ctx.fill();
    
    // 그림자 효과 제거
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // 내부 검은색 사각형 테두리
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 6, 16, 16);
    
    // 내부에 마커 본체와 유사한 청록색으로 채워진 사각형
    ctx.fillStyle = '#00bcd4';
    ctx.fillRect(13, 7, 14, 14);
    
    // 이미지 다운로드
    const link = document.createElement('a');
    link.download = 'custom-marker.png';
    link.href = canvas.toDataURL();
    link.click();
    
    console.log('마커 이미지가 생성되었습니다. 다운로드된 이미지를 src/main/resources/static/images/ 폴더에 저장해주세요.');
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    createMarkerImage();
});
