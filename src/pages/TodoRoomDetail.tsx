import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../api/API';

interface Todo {
  id: number;
  name: string;
  inscription: string;
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
}

const TodoRoomDetail: React.FC<{ roomData: RoomData | null }> = ({ roomData }) => {
  const { id } = useParams<{ id: string }>(); // URL에서 ID 가져오기

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

    // roomData가 null일 경우 데이터 요청
    if (roomData === null && id) {
      const roomId = parseInt(id, 10); // ID를 정수로 변환
      fetchData(roomId);
    } else {
      setLoading(false); // roomData가 있을 경우 로딩 종료
    }
  }, [roomData, id]);

  if (loading) {
    return <div className="text-center text-gray-500">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const dataToDisplay = fetchedData || roomData; // 최종적으로 표시할 데이터 결정

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
      </div>
    </div>
  );
};

export default TodoRoomDetail;
