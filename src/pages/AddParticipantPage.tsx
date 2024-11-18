import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { API } from '../api/API';

interface Todo {
  id: number;
  name: string;
  description: string;
}

const AddParticipantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 roomId 가져오기
  const { state } = useLocation(); // useLocation으로 상태 가져오기
  const navigate = useNavigate();
  
  const todos: Todo[] = state.todos || []; // 상태에서 todos 가져오기
  const [participantName, setParticipantName] = useState(''); // 참가자 이름 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [message, setMessage] = useState(''); // 메시지 상태
  const [bettings, setBettings] = useState(
    todos.map((todo) => ({
      todoId: todo.id,
      point: 0,
      comment: '',
    }))
  ); // 각 할 일 별 점수와 코멘트 상태 관리

  const handleBettingChange = (index: number, field: 'point' | 'comment', value: string | number) => {
    const updatedBettings = [...bettings];
    updatedBettings[index] = {
      ...updatedBettings[index],
      [field]: value,
    };
    setBettings(updatedBettings);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantName) {
      setMessage('참가자 이름을 입력해주세요.');
      return;
    }
    if (!password) {
      setMessage('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await API().post('/participant', {
        roomId: id,
        name: participantName, // 참가자 이름
        password,
        bettings,
      });
      setMessage('참가에 성공했습니다!');
      console.log(response.data);
      navigate(`/todo-room/${id}`); // 성공 시 상세 페이지로 이동
    } catch (err) {
      setMessage('참가에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-8 w-full max-w-lg"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">참가하기</h2>

        <label className="block text-gray-700 font-semibold mb-2">참가자 이름:</label>
        <input
          type="text"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="이름을 입력하세요"
        />

        <label className="block text-gray-700 font-semibold mb-2 mt-4">비밀번호:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="비밀번호를 입력하세요"
        />
        {message && <p className="text-red-500 text-sm mt-2">{message}</p>}

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">할 일 목록</h3>
        {todos.map((todo, index) => (
          <div key={todo.id} className="mb-4">
            <p className="font-semibold text-gray-700">{todo.name}</p>
            <p className="text-gray-500 text-sm">{todo.description}</p>
            <label className="block text-gray-700 mt-2">점수:</label>
            <input
              type="number"
              value={bettings[index].point}
              onChange={(e) => handleBettingChange(index, 'point', parseInt(e.target.value, 10))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="점수를 입력하세요"
            />
            <label className="block text-gray-700 mt-2">코멘트:</label>
            <input
              type="text"
              value={bettings[index].comment}
              onChange={(e) => handleBettingChange(index, 'comment', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="코멘트를 입력하세요"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
        >
          참가하기
        </button>
      </form>
    </div>
  );
};

export default AddParticipantPage;
