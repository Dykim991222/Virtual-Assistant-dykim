// API Base URL 설정
// 개발: http://localhost:8000/api/v1
// 프로덕션: 환경에 맞게 변경

// window.location.origin을 사용하여 현재 서버 주소를 자동으로 가져옴
const API_BASE_URL = `${window.location.origin}/api/v1`;

export { API_BASE_URL };
