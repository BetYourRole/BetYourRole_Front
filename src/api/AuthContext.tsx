import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // 쿠키 관리 라이브러리

interface AuthContextProps {
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 초기 로드 시 쿠키에서 토큰 가져오기
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
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
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
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
