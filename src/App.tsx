import React from 'react';
import Nav from './components/Nav';
import { Route, Routes } from 'react-router-dom';
import MakeTodoRoom from './pages/TodoRoomForm';
import TodoRoomDetail from './pages/TodoRoomDetail';
import AddParticipantPage from './pages/AddParticipantPage';
import MyPage from './pages/MyPage';

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<MakeTodoRoom />} />
        <Route path="/todo-room/:url" element={<TodoRoomDetail roomData={null} />} />
        <Route path="/todo-room/:url/join" element={<AddParticipantPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </>
  );
}

export default App;
