// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../api/AuthContext';

// const Nav: React.FC = () => {
//   const { accessToken, logout } = useAuth();
//   const { isAuthenticated } = useAuth();

//   return (
//     <div className="flex justify-between px-16 py-8 items-center sticky w-full bg-white top-0">
//       <Link to="/">
//         <div className="logo text-2xl font-bold">Bet Your Role</div>
//       </Link>
//       <div className="menu flex gap-8">
//         <Menu url="/" name="새 할일 생성" />
//         <Menu url="/how-to-use" name="사용방법" />
//         {accessToken ? (
//           <MenuExternal
//             url="/"
//             name="로그아웃"
//             onClick={(e) => {
//               e.preventDefault(); // 기본 동작 방지
//               logout(); // 로그아웃 실행
//             }}
//           />
//         ) : (
//           <MenuExternal url="http://localhost:8080/oauth2/authorization/google" name="로그인" />
//         )}
//       </div>
//     </div>
//   );
// };

// interface MenuProps {
//   url: string;
//   name: string;
// }

// const Menu: React.FC<MenuProps> = ({ url, name }) => {
//   return (
//     <Link to={url}>
//       <div className="text-l">{name}</div>
//     </Link>
//   );
// };

// interface MenuExternalProps {
//   url: string;
//   name: string;
//   onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void; // onClick 추가
// }

// const MenuExternal: React.FC<MenuExternalProps> = ({ url, name, onClick }) => {
//   return (
//     <a href={url} onClick={onClick}>
//       <div className="text-l">{name}</div>
//     </a>
//   );
// };

// export default Nav;



import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

const Nav: React.FC = () => {
  const { accessToken, login, logout } = useAuth();

  // OAuth2 로그인 URL 설정
  const oauth2LoginUrl = `http://localhost:8080/oauth2/authorization/google`;

  return (
    <div className="flex justify-between px-16 py-8 items-center sticky w-full bg-white top-0 shadow">
      {/* 로고 */}
      <Link to="/">
        <div className="logo text-2xl font-bold">Bet Your Role</div>
      </Link>

      {/* 메뉴 */}
      <div className="menu flex gap-8">
        <Menu url="/" name="새 할일 생성" />
        {/* <Menu url="/how-to-use" name="사용방법" /> */}

        {/* 로그인/로그아웃 상태에 따라 버튼 표시 */}
        {accessToken ? (
          <>
            <Menu url="/mypage" name="마이페이지" />
            <MenuExternal
              url="/"
              name="로그아웃"
              onClick={(e) => {
                e.preventDefault(); // 기본 동작 방지
                logout(); // 로그아웃 실행
              }}
            />
          </>
        ) : (
          <MenuExternal url={oauth2LoginUrl} name="로그인" />
        )}
      </div>
    </div>
  );
};

interface MenuProps {
  url: string;
  name: string;
}

const Menu: React.FC<MenuProps> = ({ url, name }) => {
  return (
    <Link to={url}>
      <div className="text-l hover:underline">{name}</div>
    </Link>
  );
};

interface MenuExternalProps {
  url: string;
  name: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void; // onClick 추가
}

const MenuExternal: React.FC<MenuExternalProps> = ({ url, name, onClick }) => {
  return (
    <a href={url} onClick={onClick}>
      <div className="text-l hover:underline">{name}</div>
    </a>
  );
};

export default Nav;
