import React from 'react';
import Nav from './components/Nav'
import { Route, Routes } from 'react-router-dom';
import MakeTodoRoom from './pages/TodoRoomForm';
import TodoRoomDetail from './pages/TodoRoomDetail';

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<MakeTodoRoom/>} />
        <Route path="/todo-room/:id" element={<TodoRoomDetail roomData={null} />} />

      </Routes>
    </>
  );
}


export default App;
