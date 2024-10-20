import React from 'react';
import Nav from './components/Nav'
import { Route, Routes } from 'react-router-dom';
import MakeTodoRoom from './pages/TodoRoomForm';

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<MakeTodoRoom/>} />
      </Routes>
    </>
  );
}

export default App;
