import React from 'react';
import Nav from './components/Nav';
import { Route, Routes } from 'react-router-dom';
import MakeTodoRoom from './pages/TodoRoomForm';
import TodoRoomDetail from './pages/TodoRoomDetail';
import AddParticipantPage from './pages/AddParticipantPage';

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<MakeTodoRoom />} />
        <Route path="/todo-room/:id" element={<TodoRoomDetail roomData={null} />} />
        <Route path="/todo-room/:id/join" element={<AddParticipantPage />} />
      </Routes>
    </>
  );
}

export default App;
