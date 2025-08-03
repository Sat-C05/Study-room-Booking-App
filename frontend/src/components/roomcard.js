import { Link } from 'react-router-dom';

function RoomCard({ room }) {
  return (
    <div style={{ border: '1px solid gray', padding: '16px', margin: '10px' }}>
      <h2>{room.name}</h2>
      <p>Capacity: {room.capacity}</p>
      <Link to={`/book/${room._id}`}>Book Room</Link>
    </div>
  );
}

export default RoomCard;
