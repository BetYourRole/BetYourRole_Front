import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../api/API';

interface Todo {
  id: number;
  name: string;
  inscription: string;
}

interface Participant {
  name: string;
  createDate: string;
  updateDate: string;
}

interface RoomData {
  id: number;
  name: string;
  inscription: string;
  headCount: number;
  participantCount: number;
  matchingType: string;
  point: number;
  state: string;
  visibility: boolean;
  todos: Todo[];
  participants: Participant[]; // 참가자 목록
}

const TodoRoomDetail: React.FC<{ roomData: RoomData | null }> = ({ roomData }) => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fetchedData, setFetchedData] = useState<RoomData | null>(roomData);

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

  if (loading) {
    return <div className="text-center text-gray-500">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const dataToDisplay = fetchedData || roomData;

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-screen-lg mx-4 lg:mx-8">
        <h2 className="text-3xl font-bold mb-4">{dataToDisplay?.name}</h2>
        <p className="text-gray-700 mb-6">{dataToDisplay?.inscription}</p>
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
              <strong>{todo.name}:</strong> {todo.inscription}
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
      </div>
    </div>
  );
};

export default TodoRoomDetail;
