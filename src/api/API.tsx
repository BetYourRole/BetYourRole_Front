import axios, { AxiosInstance } from 'axios';
import { isTokenExpired } from './AuthContext';

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