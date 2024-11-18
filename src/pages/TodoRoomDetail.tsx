import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../api/API';

interface Todo {
  id: number;
  name: string;
  description: string;
  winner: string | null;
}

interface Participant {
  name: string;
  createDate: string;
  updateDate: string;
}

interface RoomData {
  id: number;
  name: string;
  description: string;
  headCount: number;
  participantCount: number;
  matchingType: string;
  point: number;
  state: string;
  visibility: boolean;
  todos: Todo[];
  participants: Participant[];
}

const TodoRoomDetail: React.FC<{ roomData: RoomData | null }> = ({ roomData }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fetchedData, setFetchedData] = useState<RoomData | null>(roomData);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async (id: number) => {
      try {
        const response = await API().get(`/todo-room/${id}`);
        setFetchedData(response.data);
      } catch (err) {
        setError('방 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (roomData === null && id) {
      const roomId = parseInt(id, 10);
      fetchData(roomId);
    } else {
      setLoading(false);
    }
  }, [roomData, id]);

  const handleJoinRoom = () => {
    navigate(`/todo-room/${fetchedData?.id}/join`, { state: { todos: fetchedData?.todos } });
  };

  const handleDraw = async () => {
    try {
      const response = await API().post('/todo-room/draw', {
        id: fetchedData?.id,
        password,
      });
      setFetchedData(response.data);
      setMessage('추첨이 완료되었습니다!');
    } catch (err) {
      setMessage('추첨에 실패했습니다. 비밀번호를 확인해주세요.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const dataToDisplay = fetchedData || roomData;

  // 추첨 버튼 비활성화 여부 및 설명 메시지
  const isDrawButtonDisabled =
    dataToDisplay?.headCount !== dataToDisplay?.todos.length ||
    dataToDisplay?.participantCount !== dataToDisplay?.headCount;
  const drawButtonMessage =
    isDrawButtonDisabled &&
    '참가자 수와 역할 수가 일치하지 않아 추첨을 진행할 수 없습니다.';

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-screen-lg mx-4 lg:mx-8">
        <h2 className="text-3xl font-bold mb-4">{dataToDisplay?.name}</h2>
        <p className="text-gray-700 mb-6">{dataToDisplay?.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <strong>인원 수:</strong> {dataToDisplay?.headCount} / {dataToDisplay?.participantCount}
          </div>
          <div>
            <strong>매칭 타입:</strong> {dataToDisplay?.matchingType}
          </div>
          <div>
            <strong>포인트:</strong> {dataToDisplay?.point}
          </div>
          <div>
            <strong>상태:</strong> {dataToDisplay?.state}
          </div>
          <div>
            <strong>가시성:</strong> {dataToDisplay?.visibility ? '공개' : '비공개'}
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-2">할 일 목록</h3>
        <ul className="list-disc list-inside">
          {dataToDisplay?.todos.map((todo) => (
            <li key={todo.id} className="mb-2">
              <strong>{todo.name}:</strong> {todo.description}
              {todo.winner && (
                <p className="text-blue-500 text-sm">승자: {todo.winner}</p>
              )}
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">참가자 목록</h3>
        <ul className="list-inside">
          {dataToDisplay?.participants.map((participant, index) => (
            <li key={index} className="mb-2">
              <p className="text-gray-700">
                <strong>이름:</strong> {participant.name}
              </p>
              <p className="text-gray-500 text-sm">
                <strong>참가 날짜:</strong> {new Date(participant.createDate).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>

        {dataToDisplay?.state === 'BEFORE' && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">참가하기</h3>
            <button
              onClick={handleJoinRoom}
              className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mt-4"
            >
              참가하기
            </button>
          </div>
        )}

        {dataToDisplay?.state === 'BEFORE' && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">추첨하기</h3>
            <label className="block text-gray-700 font-semibold mb-2">비밀번호:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호를 입력하세요"
            />
            {drawButtonMessage && (
              <p className="text-red-500 text-sm mb-2">{drawButtonMessage}</p>
            )}
            <button
              onClick={handleDraw}
              disabled={isDrawButtonDisabled}
              className={`w-full py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 mt-4 ${
                isDrawButtonDisabled
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
              }`}
            >
              추첨하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoRoomDetail;
