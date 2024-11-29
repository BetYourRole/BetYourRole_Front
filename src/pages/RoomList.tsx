import React from 'react';

interface Room {
  name: string;
  description: string;
  url: string;
  state: string;
  participantCount: number;
}

interface RoomListProps {
  rooms: Room[];
}

const RoomList: React.FC<RoomListProps> = ({ rooms }) => {
  if (rooms.length === 0) {
    return <p>No rooms available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <div key={room.url} className="border p-4 rounded shadow">
          <h3 className="font-bold text-lg">{room.name}</h3>
          <p className="text-gray-600">{room.description}</p>
          <p className="text-sm text-gray-500">State: {room.state}</p>
          <p className="text-sm text-gray-500">Participants: {room.participantCount}</p>
          <a href={`/todo-room/${room.url}`} className="text-blue-500 underline mt-2 block">
            View Room
          </a>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
