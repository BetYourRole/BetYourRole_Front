import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { API } from '../api/API';
import { Todo } from './types';
import { useAuth } from '../api/AuthContext';

const AddParticipantPage: React.FC = () => {
  const { url } = useParams<{ url: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [todos, setTodos] = useState<Todo[]>(state?.todos || []);
  const [participantName, setParticipantName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [warning, setWarning] = useState<string>('');
  const [bettings, setBettings] = useState<{ todoId: number; point: number; comment: string }[]>([]);
  const [maxPoint, setMaxPoint] = useState<number>(state?.maxPoint || 0);
  const { isLoggedIn } = useAuth();


  // Fetch todos if not provided in state
  useEffect(() => {
    if (url !== undefined && (!state || !state.todos)) {
      const fetchTodos = async (url: string) => {
        try {
          const response = await API().get(`/todo-room/${url}`);
          setTodos(response.data.todos);
          setMaxPoint(response.data.point);
        } catch (error) {
          console.error('Error fetching todos:', error);
        }
      };
      fetchTodos(url);
    }
  }, [url, state]);

  // Initialize bettings when todos are updated
  useEffect(() => {
    if (todos.length > 0) {
      setBettings(
        todos.map((todo) => ({
          todoId: todo.id,
          point: 0,
          comment: '',
        }))
      );
    }
  }, [todos]);

  const calculateTotalPoints = () => {
    return bettings.reduce((sum, betting) => sum + (betting.point || 0), 0);
  };

  const handleBettingChange = (index: number, field: 'point' | 'comment', value: string | number) => {
    const updatedBettings = [...bettings];
    updatedBettings[index] = {
      ...updatedBettings[index],
      [field]: value,
    };
    setBettings(updatedBettings);

    // Check if total points exceed maxPoint
    if (field === 'point') {
      const totalPoints = calculateTotalPoints() + (value as number) - bettings[index].point;
      if (totalPoints > maxPoint) {
        setWarning(`총 점수가 최대 점수(${maxPoint})를 초과했습니다.`);
      } else {
        setWarning('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantName) {
      setMessage('참가자 이름을 입력해주세요.');
      return;
    }
    if (!isLoggedIn && !password) {
      setMessage('비밀번호를 입력해주세요.');
      return;
    }
    if (calculateTotalPoints() > maxPoint) {
      setWarning('총 점수가 최대 점수를 초과하여 참가할 수 없습니다.');
      return;
    }
    try {
      const response = await API().post(`/participant/${url}`, {
        name: participantName,
        password,
        bettings,
      });
      setMessage('참가에 성공했습니다!');
      console.log(response.data);
      navigate(`/todo-room/${url}`);
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

        {!isLoggedIn && (<>
          <label className="block text-gray-700 font-semibold mb-2 mt-4">비밀번호:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="비밀번호를 입력하세요"
          />
          {message && <p className="text-red-500 text-sm mt-2">{message}</p>}
        </>)}

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">할 일 목록</h3>
        {bettings.length > 0 &&
          todos.map((todo, index) => (
            <div key={todo.id} className="mb-4">
              <p className="font-semibold text-gray-700">{todo.name}</p>
              <p className="text-gray-500 text-sm">{todo.description}</p>
              <label className="block text-gray-700 mt-2">점수:</label>
              <input
                type="number"
                value={bettings[index]?.point || 0}
                onChange={(e) => handleBettingChange(index, 'point', parseInt(e.target.value, 10))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="점수를 입력하세요"
              />
              <label className="block text-gray-700 mt-2">코멘트:</label>
              <input
                type="text"
                value={bettings[index]?.comment || ''}
                onChange={(e) => handleBettingChange(index, 'comment', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="코멘트를 입력하세요"
              />
            </div>
          ))}
          
        {warning && <p className="text-yellow-500 text-sm mt-2">{warning}</p>}
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
