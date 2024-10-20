import axios from 'axios';

export const API = () => {
  // const token = localStorage.getItem('Token');

  const instance = axios.create({
    baseURL:  'http://localhost:8080/'
  });

  // 토큰이 있는 경우에만 헤더에 추가
  // if (token) {
  //   instance.defaults.headers.common['Authorization'] = token;
  // }
  return instance;
};