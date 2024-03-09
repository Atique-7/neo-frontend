import React, { useState, useEffect } from 'react';
import { msToTime } from '../../utils/utilFunctions'; // Assuming msToTime exists
import { useSelector, useDispatch } from 'react-redux';
import { updateSession, shiftToPayment } from '../../redux/sessionSlice';

const Timer = ({ session }) => {
  const startTime = useSelector(state => state.sessio.sessions.find(sessio => sessio.sessionId === session.sessionId).startTime);
  const plannedDuration = useSelector(state => state.sessio.sessions.find(sessio => sessio.sessionId === session.sessionId).plannedDuration);
  const isSessionEnding = useSelector(state => state.sessio.sessions.find(sessio => sessio.sessionId === session.sessionId).isSessionEnding);
  const sessionEnded = useSelector(state => state.sessio.sessions.find(sessio => sessio.sessionId === session.sessionId).sessionEnded);

  const [remainingTime, setRemainingTime] = useState(plannedDuration);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSessionEnding === false) {
      const intervalId = setInterval(() => {
        const newRemainingTime = Math.max(plannedDuration - (Date.now() - startTime), 0);
        const element = document.getElementById(session.sessionId);
        setRemainingTime(newRemainingTime);
        console.log(newRemainingTime)
        if(newRemainingTime === 0 && session.isSessionStarted === true){
          console.log("ran")
          dispatch(updateSession({sessionId: session.sessionId, newData: { isSessionEnding: true}}))
        }
        if(newRemainingTime < 10 * 60 * 1000 && session.isSessionStarted == true) {
          element.style.backgroundColor = "red";
        } else {
          element.style.backgroundColor = "";
        }
        
      }, 1000); // Update every second
      return () => clearInterval(intervalId); // Cleanup on unmount
    }

    if (sessionEnded === true) {
      const finalRemainingTime = Math.max(plannedDuration - (Date.now() - startTime), 0);
      dispatch(updateSession({ sessionId: session.sessionId, newData: { remainingTime: finalRemainingTime} }));
      console.log(session.remainingTime);
      console.log("timeRecorded")
      dispatch(updateSession({ sessionId: session.sessionId, newData: { sessionEnded: false } }));
      dispatch(shiftToPayment({sessionId: session.sessionId}));
    }

  }, [dispatch, startTime, plannedDuration, sessionEnded, isSessionEnding]); // Add sessionEnded to the dependency array
  

  return (
    <div>
      {isSessionEnding === false ? 
      (<p className='mb-2 text-sm font-bold font-mono'>Remaining Time: {msToTime(remainingTime)}</p>) 
      : (<p className='mb-2 text-sm font-bold font-mono'>Remaining Time: {msToTime(session.remainingTime)}</p>)}
    </div>
  );
};

export default Timer;
