import React from 'react';
import SessionList from '../pages/sessionPages/sessionList'
import { useSelector } from 'react-redux';
import EndedSessionCard from '../pages/sessionPages/EndedSession';

const Home = () => {

  let endedSessions = useSelector(state => state.sessio.endedSessions || []);

  return (
    <div>
      {/* <Navbar /> */}
      <div className="grid grid-cols-1 h-full md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border-r h-full border-gray-100 p-4">
          <h2 className="text-lg font-semibold mb-4">PS5</h2>
          <SessionList sessionType="PS5" />
        </div>
        <div className="border-r border-gray-100 p-4">
          <h2 className="text-lg font-semibold mb-4">PS4</h2>
          <SessionList sessionType="PS4" />
        </div>
        <div className="border-r border-gray-100 p-4">
          <h2 className="text-lg font-semibold mb-4">Snooker</h2>
          <SessionList sessionType="Snooker" />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Pool</h2>
          <SessionList sessionType="Pool" />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mt-8 font-mono mx-4">Ended Sessions</h2>
        <div>
          {endedSessions.map((session) => (
            <EndedSessionCard key={session.sessionId} session={session} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
