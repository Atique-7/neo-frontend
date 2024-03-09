import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import SessionCard from '../sessionPages/sessionCard';
import SessionForm from '../sessionPages/sessionPage';


const SessionList = ({ sessionType }) => {
  let sessions = useSelector(state => state.sessio.sessions || []);
  console.log(sessions)

  const filteredSessions = sessions.filter((s) => s.sessionType === sessionType)

  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="mx-auto">
      <div className="mb-4">
        <button onClick={handleShowForm} className="bg-green-800 text-xl h-8 rounded-md w-14 hover:bg-green-600 font-mono font-bold focus:outline-none">
          +
        </button>
      </div>
      <div className="">
      {filteredSessions.map((session, index) => (
          <MemoizedSessionCard key={session.sessionId} session={session} /> // Use unique session.id as key
        ))}
      </div>
      {showForm && (
        <SessionForm sessionType={sessionType} visible={showForm} onClose={handleCloseForm} />
      )}
    </div>
  );
};
const MemoizedSessionCard = React.memo(SessionCard);
export default SessionList;
// import React, { useState, useMemo } from 'react';
// import { useSelector } from 'react-redux';
// import SessionCard from '../sessionPages/sessionCard';
// import SessionForm from '../sessionPages/sessionPage';

// const SessionList = ({ sessionType }) => {
//   const sessions = useSelector(state => state.session.sessions);
//   console.log(sessions)
//   const sessionIds = sessions.map(session => session.sessionId); // Get session IDs for filtering

//   const filteredSessions = useMemo(() => {
//     return sessions.filter(session => session.sessionType === sessionType);
//   }, [sessions, sessionType]);

//   console.log(filteredSessions)

//   const [showForm, setShowForm] = useState(false);

//   const handleShowForm = () => {
//     setShowForm(true);
//   };

//   const handleCloseForm = () => {
//     setShowForm(false);
//   };

//   return (
//     <div className="mx-auto">
//       <div className="mb-4">
//         <button onClick={handleShowForm} className="bg-green-800 text-xl h-8 rounded-md w-14 hover:bg-green-600 font-mono font-bold focus:outline-none">
//           +
//         </button>
//       </div>
//       <div className="">
//         {filteredSessions.length > 0 ? (
//           filteredSessions.map((session, index) => (
//             <SessionCard key={session.sessionId} session={session} />
//           ))
//         ) : (
//           <p>No sessions found for this type.</p>
//         )}
//       </div>
//       {showForm && (
//         <SessionForm sessionType={sessionType} visible={showForm} onClose={handleCloseForm} />
//       )}
//     </div>
//   );
// };

// export default SessionList;

