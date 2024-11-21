import axios, { AxiosInstance } from 'axios';
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;  // 만료 시간 (expiration)
  iat?: number;  // 발행 시간 (issued at)
  // 필요한 경우 추가 필드를 정의할 수 있습니다.
}

export const API = (): AxiosInstance => {
  const instance = axios.create({
    baseURL:  'http://localhost:8080/',
    withCredentials: true,
  });

  const token = localStorage.getItem('accessToken');
  if(token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

 instance.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem('accessToken');

    // Access Token의 유효성 확인
    if (accessToken && isTokenExpired(accessToken)) {
      try {
        const newAccessToken = await getNewAccessToken();
        if (newAccessToken) {
          accessToken = newAccessToken;
          localStorage.setItem('accessToken', newAccessToken);
          config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
      } catch (error) {
        console.error('Access Token 재발급 실패:', error);
        // 리프레시 토큰도 만료되었거나 재발급에 실패한 경우
        return Promise.reject(error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

  return instance;
};

// Access Token이 만료되었는지 확인하는 함수
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (decoded.exp) {
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    }
    return false;
  } catch (error) {
    console.error('토큰 디코딩 실패:', error);
    return true;
  }
};

// 새로운 Access Token 발급
const getNewAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post('http://localhost:8080/api/login/reissue', {}, { withCredentials: true });
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Access Token 재발급 요청 실패:', error);
    return null;
  }
};