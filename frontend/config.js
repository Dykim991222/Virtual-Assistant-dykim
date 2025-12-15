// API Base URL 설정
// Electron: window.BACKEND_URL이 main.js에서 주입됨
// 브라우저: window.location.origin 사용 (배포 시)
const API_BASE_URL = (window.BACKEND_URL || window.location.origin) + '/api/v1';

export { API_BASE_URL };
