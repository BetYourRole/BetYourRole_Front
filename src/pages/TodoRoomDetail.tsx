import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../api/API';
import { getTokenEmail } from '../api/AuthContext';

interface Todo {
  id: number;
  name: string;
  description: string;
  winner: Winner;
}

interface Winner {
  name: string;
  comment: string;
}

interface Participant {
  id: number;
  name: string;
  createDate: string;
  updateDate: string;
}

interface RoomData {
  url: string;
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
  roomOwner: string;
}

const TodoRoomDetail: React.FC<{ roomData: RoomData | null }> = ({ roomData }) => {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fetchedData, setFetchedData] = useState<RoomData | null>(roomData);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async (url: string) => {
      try {
        const response = await API().get(`/todo-room/${url}`);
        setFetchedData(response.data);
      } catch (err) {
        setError('방 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (roomData === null && url) {
      fetchData(url);
    } else {
      setLoading(false);
    }
  }, [roomData, url]);

  const handleJoinRoom = () => {
    navigate(`/todo-room/${fetchedData?.url}/join`, { state: { todos: fetchedData?.todos, maxPoint: fetchedData?.point } });
  };

  const handleEditAccess = async () => {

    if (fetchedData?.roomOwner === '비회원') {
      setShowPasswordInput(true);
    } else if (fetchedData?.roomOwner === getTokenEmail()) {
      setEditMode(true);
      setMessage('수정 모드로 전환되었습니다.');
    } else {
      setMessage('수정 권한이 없습니다.');
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await API().post(`/todo-room/${fetchedData?.url}/check-permission`, {
        password,
      });
      console.log(response)
      if (response.data.valid) {
        setEditMode(true);
        setMessage('수정 모드로 전환되었습니다.');
      } else {
        setMessage('비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      setMessage('비밀번호 확인에 실패했습니다.');
      console.error(err);
    } finally {
      setShowPasswordInput(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000); // 3초 후 메시지 사라짐
      return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 클리어
    }
  }, [message]);

  const dataToDisplay = fetchedData || roomData;



  const handleDrawSubmit = async () => {

    const isDrawButtonDisabled =
    dataToDisplay?.headCount !== dataToDisplay?.todos.length ||
    dataToDisplay?.participantCount !== dataToDisplay?.headCount;

    if(isDrawButtonDisabled){
      setMessage("참가자 수와 역할 수가 일치하지 않아 추첨을 진행할 수 없습니다.")
      return;
    }
    try {
      const response = await API().post(`/todo-room/${fetchedData?.url}/draw`, {
        password,
      });
      setFetchedData(response.data);
      setMessage('추첨이 완료되었습니다!');
      setEditMode(false);
    } catch (err) {
      setMessage('추첨에 실패했습니다.');
      console.error(err);
    }
  };

  const handleDeleteParticipant = async (id: number, name: string) => {
    try {
      await API().delete(`/participant/${id}`, {
        data: { name, password },
      });
      setFetchedData((prev) => ({
        ...prev!,
        participants: prev!.participants.filter((participant) => participant.id !== id),
      }));
      setMessage(`${name} 참가자가 삭제되었습니다.`);
    } catch (err) {
      console.error('참가자 삭제 실패:', err);
      setMessage('참가자를 삭제할 수 없습니다.');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

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
                <p className="text-blue-500 text-sm">승자: {todo.winner.name} {todo.winner.comment.length !== 0 && " \""+(todo.winner.comment)+"\""}</p>
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
              {editMode && (
                <button
                  onClick={() => handleDeleteParticipant(participant.id, participant.name)}
                  className="bg-red-500 text-white font-semibold px-3 py-1 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mt-2"
                >
                  삭제
                </button>
              )}
            </li>
          ))}
        </ul>

        {editMode && fetchedData?.state === 'BEFORE' && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">추첨하기</h3>
            <button
              onClick={handleDrawSubmit}
              className={`w-full py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 mt-4 bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500`}
            >
              추첨하기
            </button>
          </div>
        )}
        {message && (
          <div className={`mt-4 p-4 rounded-lg text-white transition-opacity duration-300 ${message.includes('실패') || message.includes('없습니다') ? 'bg-red-500' : 'bg-green-500'}`}>
            {message}
          </div>
        )}
        {dataToDisplay?.state === 'BEFORE' && !showPasswordInput && <>
        {!editMode ? (
          <button
            onClick={handleEditAccess}
            className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 mt-6"
          >
            수정
          </button>
        ) : (
          <button
            onClick={() => setEditMode(false)}
            className="w-full bg-gray-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mt-6"
          >
            수정 완료
          </button>
        )}</>}

        {showPasswordInput && (
          <div className="mt-6">
            <label className="block text-gray-700 font-semibold mb-2">비밀번호:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호를 입력하세요"
            />
            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-gray-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mt-6"
            >
              수정
            </button>
          </div>
        )} 

        {dataToDisplay?.state === 'BEFORE' && !editMode && (
          <div className="mt-6">
            <button
              onClick={handleJoinRoom}
              className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mt-4"
            >
              참가하기
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default TodoRoomDetail;
