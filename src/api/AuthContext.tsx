import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // 쿠키 관리 라이브러리
import { jwtDecode } from "jwt-decode";

interface AuthContextProps {
  accessToken: string | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(isValidAccessToken());
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 초기 로드 시 쿠키에서 토큰 가져오기
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      setIsLoggedIn(true);
    }
  }, []);

  // URL에서 accessToken 추출 후 쿠키에 저장
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('accessToken');
    if (token) {
      localStorage.setItem('accessToken', token);
      // Cookies.set('accessToken', token, { expires: 1, secure: true }); // 1일 만료, secure 옵션 설정
      setAccessToken(token);
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  const login = (token: string) => {
    localStorage.setItem('accessToken', token);
    // Cookies.set('accessToken', token, { expires: 1, secure: true });
    setAccessToken(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setIsLoggedIn(false);
    //여기 리프레시는 왜 안없앰? 원래 그러나
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


// Access Token이 만료되었는지 확인하는 함수
export const isTokenExpired = (token: string): boolean => {
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

export const isValidAccessToken= ():boolean => {
  let accessToken = localStorage.getItem('accessToken');
  if(accessToken == null || isTokenExpired(accessToken)){
    return false;
  }
  return true;
}

interface JwtPayload {
  exp?: number;  // 만료 시간 (expiration)
  iat?: number;  // 발행 시간 (issued at)
  // 필요한 경우 추가 필드를 정의할 수 있습니다.
}