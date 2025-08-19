// 마커 이미지 생성 및 서버 저장
function generateMarkerImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 40;
    canvas.height = 50;

    // 그림자 효과
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // 그라데이션 배경 (밝은 청록색/터키스)
    const gradient = ctx.createLinearGradient(0, 0, 40, 50);
    gradient.addColorStop(0, '#00bcd4');    // 밝은 청록색
    gradient.addColorStop(0.5, '#00acc1');  // 중간 청록색
    gradient.addColorStop(1, '#0097a7');    // 진한 청록색

    // 핀/물방울 모양 그리기
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(20, 0);   // 상단 정점
    ctx.lineTo(33, 30);  // 우측 하단
    ctx.lineTo(20, 27);  // 우측 내부
    ctx.lineTo(7, 30);   // 좌측 하단
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
    ctx.strokeRect(12, 5, 16, 16);

    // 내부에 마커 본체와 유사한 청록색으로 채워진 사각형
    ctx.fillStyle = '#00bcd4';
    ctx.fillRect(13, 6, 14, 14);

    // 이미지를 Blob으로 변환
    canvas.toBlob(function(blob) {
        // FormData 생성
        const formData = new FormData();
        formData.append('markerImage', blob, 'custom-marker.png');

        // 서버에 이미지 저장 요청
        fetch('/api/marker/save', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('✅ 마커 이미지가 성공적으로 저장되었습니다!');
                console.log('저장 경로:', data.path);
            } else {
                console.error('❌ 마커 이미지 저장 실패:', data.message);
            }
        })
        .catch(error => {
            console.error('❌ 마커 이미지 저장 중 오류 발생:', error);
        });
    }, 'image/png');
}

// 페이지 로드 시 자동 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 마커 이미지 생성 시작...');
    generateMarkerImage();
});
