import React, { useEffect, useState } from 'react';
import RoomList from './RoomList';
import { API } from '../api/API'; // API 파일을 가져옵니다

const MyPage: React.FC = () => {
  const [createdRooms, setCreatedRooms] = useState([]);
  const [participatedRooms, setParticipatedRooms] = useState([]);
  const [activeTab, setActiveTab] = useState<'created' | 'participated'>('created');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      const apiInstance = API(); // API 인스턴스 생성
      try {
        // API 요청
        const [createdResponse, participatedResponse] = await Promise.all([
          apiInstance.get('/api/my-page/created-rooms'),
          apiInstance.get('/api/my-page/participated-rooms'),
        ]);
        setCreatedRooms(createdResponse.data);
        setParticipatedRooms(participatedResponse.data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Page</h1>

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 border ${
            activeTab === 'created' ? 'bg-green-500 text-white' : 'bg-white text-green-500'
          }`}
          onClick={() => setActiveTab('created')}
        >
          Created
        </button>
        <button
          className={`px-4 py-2 border ${
            activeTab === 'participated' ? 'bg-green-500 text-white' : 'bg-white text-green-500'
          }`}
          onClick={() => setActiveTab('participated')}
        >
          Responded
        </button>
      </div>

      {/* Room List */}
      {activeTab === 'created' && <RoomList rooms={createdRooms} />}
      {activeTab === 'participated' && <RoomList rooms={participatedRooms} />}
    </div>
  );
};

export default MyPage;
