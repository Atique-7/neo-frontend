import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSession, endSession, deleteSession, shiftToPayment} from '../../redux/sessionSlice';
import { calculateCost, calculateTokens, msToTime, calculateRemainingTime } from '../../utils/utilFunctions';
import api from '../../utils/api';
import ConfirmationModal from '../../components/ConfirmationModal';
import ReverseTimer from './timer';

const SessionCard = ({ session }) => {
  {console.log(session)}
  const dispatch = useDispatch();
  const [gpay, setGpay] = useState(0);
  const [cash, setCash] = useState(0);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [tokenUseable, setTokenUseable] = useState(0);
  const [recalculatedAmount, setRecalculatedAmount] = useState(session.amount);

  const isSessionEnding = useSelector(state => state.sessio.sessions.find(sessio => sessio.sessionId === session.sessionId).isSessionEnding);

  useEffect(() => {
    if(isSessionEnding == true){
      stopSessionHandler()
    }
    if (session.sessionEnded === true) {
      dispatch(endSession(session.sessionId));
    }
  }, [session.sessionEnded, isSessionEnding]);
  
  const startSession = () => {
    dispatch(updateSession({ sessionId: session.sessionId, newData: { isSessionStarted: true, startTime: Date.now(), endTime: Date.now() + session.plannedDuration } }));
  };

  // const startSession = () => {
  //   console.log(session.sessionId)
  //   console.log(session)
  //   dispatch(updateSession({ sessionId: session.sessionId, newData: { isSessionStarted: true }}));
  //   //setIsSessionStarted(true);
  //   // setTimer(setInterval(() => {
  //   //   setRemainingTime(prevTime => prevTime - 1000);
  //   //   console.log(`time: ${remainingTime}`)
  //   // }, 1000));
  //   // console.log(`time: ${remainingTime}`)
  //   // setTimer(setInterval(() => {
  //   //   dispatch(updateSession({ sessionId: session.sessionId, newData: { remainingTime: remainingTime - 1000 }}));
  //   //   console.log("!")
  //   // }, 1000));
  // };

  const addTime = (timeToAdd) => {
    dispatch(updateSession({ sessionId: session.sessionId, newData: { plannedDuration: session.plannedDuration + timeToAdd}}))
  };

  const stopSessionHandler = () => {
    let amount = 0;
    if(session.frame){
      amount = session.frames * session.price;
    } else {
      amount = calculateCost(session.plannedDuration, session.price)
    }
    console.log(amount);
    dispatch(updateSession({sessionId: session.sessionId, newData: { isSessionEnding: true, amount: amount, sessionEnded: true}}));
    console.log(session.remainingTime)
  };

  const deleteSessionHandler = () => {
    dispatch(deleteSession({sessionId: session.sessionId}))
    dispatch(endSession({sessionId: session.sessionId}));
  };

  const updateAmount = (value) => {
    const originalAmount = session.amount;
    const token_amount = value * session.price;
    setRecalculatedAmount(originalAmount - token_amount);
    setTokensUsed(value);
  }

  const endSessionHandler = async () => {
    if(tokensUsed > 0) {
      dispatch(updateSession({sessionId: session.sessionId, newData: { amount: recalculatedAmount }}))
    }

    const totalPayment = Number(gpay) + Number(cash);
    if (totalPayment > session.amount) {
      console.error("Error: Payment exceeds total amount.");
      return;
    }

    handleClosePaymentForm();

    let tokensSaved = 0;
    if (!session.frame) {
      tokensSaved = calculateTokens(session.remainingTime);
    }

    const requestData = {
      session_id: session.sessionId,
      session_type: session.sessionType,
      actual_duration: session.plannedDuration - session.remainingTime,
      planned_duration: session.plannedDuration,
      tokens_saved: tokensSaved,
      tokens_spent: tokensUsed,
      amount: (!session.frame && tokensUsed > 0) ? recalculatedAmount : session.amount,
      online: gpay,
      cash: cash,
    }

    console.log(requestData)

    try {
      const response = await api.put(`session/${session.sessionId}/`, requestData);
      const data = response.data; 
      console.log('Data from backend:', data);
      dispatch(endSession({sessionId: session.sessionId}));
    } catch (error) {
      console.error('Request error:', error);
    } finally {
      console.log('Request completed');
    }
    dispatch(endSession({sessionId: session.sessionId}));
  };

  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleShowPaymentForm = () => {
    setTokenUseable(calculateTokens(session.remainingTime));
    setShowPaymentForm(true);
    console.log(session.amount)
  };

  const handleClosePaymentForm = () => {
    setTokensUsed(0);
    setRecalculatedAmount(session.amount);
    setShowPaymentForm(false);
  };

  return (
    <div id={session.sessionId} className="border-dotted mb-4 border-2 border-gray-200 rounded p-2">
      <h2 className="text-lg font-mono font-bold mb-2">{session.customerName}</h2>
      <p className="mb-2 text-sm font-bold font-mono">Planned Duration: {msToTime(session.plannedDuration)}</p>
      <ReverseTimer session={session}/>
      {session.isSessionStarted ? (
        <>
          {(!session.isSessionEnding) && (
            <div className="flex mb-4">
              {!session.frame && (
                <>
                  <button onClick={() => addTime(30 * 60 * 1000)} className="btn btn-sm btn-secondary mr-2">+30 min</button>
                  <button onClick={() => addTime(60 * 60 * 1000)} className="btn btn-sm btn-secondary mr-2">+60 min</button>
                </>
              )}
              <button onClick={() => stopSessionHandler()} className="btn btn-sm btn-danger">End</button>
            </div>
          )}
        </>
      ) : (
        <button onClick={() => startSession()} className="btn btn-sm w-28 btn-success mb-1">START</button>
      )}
      {session.isSessionEnding && (
        <div className="flex mb-4">
          <button onClick={() => handleShowPaymentForm()} className="btn btn-sm btn-secondary mr-2">Pay</button>
          <ConfirmationModal onConfirm={() => endSessionHandler()} message="Are you sure you want to pay later?" buttonText="Pay Later" classNames="btn btn-sm btn-primary "/>
          <ConfirmationModal onConfirm={() => deleteSessionHandler()} message="Are you sure you?" buttonText="Delete" classNames="btn btn-sm btn-error ml-auto"/>
        </div>
      )}
      {showPaymentForm && (
        <div id="container" className="fixed inset-0 bg-red bg-opacity-30 backdrop-blur-sm flex justify-center items-center w-full h-full">
          <div className="relative bg-black p-6 rounded-lg w-80">
            <button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2" onClick={() => handleClosePaymentForm()}>✕</button>
            <form className="mb-4">
              <p className="mb-2">Cost: {session.amount}</p>
              {(!session.frame && session.tokensAvailable > 0) && (
                <>
                  <p className="mb-2">Available Tokens: {session.tokensAvailable}</p>
                  <p className="mb-2">Recalculated Amount: {recalculatedAmount}</p>
                  <input
                    type="number"
                    onChange={(e) => updateAmount(e.target.value)}
                    placeholder="Tokens to Use"
                    className="input input-md w-full mb-2"
                    max={tokenUseable + 1} // Set upper limit to available tokens
                  />
                </>
              )}
              <input type="number" onChange={(e) => setGpay(e.target.value)} placeholder="GPay" className="input input-md w-full mb-2" />
              <input type="number" onChange={(e) => setCash(e.target.value)} placeholder="Cash" className="input input-md w-full mb-2" />
              <ConfirmationModal onConfirm={() => endSessionHandler()} message="Are you sure?" buttonText="Save" classNames="btn btn-sm btn-primary w-full"/>
            </form>
          </div>
        </div>
      )}
    </div>
  );

};

export default SessionCard;