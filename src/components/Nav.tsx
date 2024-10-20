import React from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';

const Nav:React.FC = () => {
    return (
        <div className='flex justify-between px-16 py-8 items-center sticky w-full bg-white top-0'>
                <Link to='/'><div className="logo text-2xl font-bold">Bet Your Role</div></Link>
            <div className='menu flex gap-8'>
                <Menu url="/" name="새 할일 생성"/>
                <Menu url="/how-to-use" name="사용방법"/>
                <Menu url="/login" name="로그인"/>
            </div>
        </div>
    )
}

interface MenuProps{
    url : string,
    name : string
}
const Menu:React.FC<MenuProps> = ({ url, name }) =>{
    const location = useLocation();
    const isActive = location.pathname === url;

    return(
        <Link to={url}><div className={`text-l ${isActive ? "text-blue-500 font-bold " : ""}`}>{name}</div></Link>
    )
}

export default Nav;