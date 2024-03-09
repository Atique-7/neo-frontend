import { msToTime, calculateTokens} from '../../utils/utilFunctions';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSession, endSession, deleteSession } from '../../redux/sessionSlice';
import ConfirmationModal from '../../components/ConfirmationModal';
import API from '../../utils/api';

const EndedSessionCard = ({ session }) => {

    const dispatch = useDispatch();
    const [gpay, setGpay] = useState(0);
    const [cash, setCash] = useState(0);
    const [tokensUsed, setTokensUsed] = useState(0);
    const [tokenUseable, setTokenUseable] = useState(0);
    const [recalculatedAmount, setRecalculatedAmount] = useState(session.amount);

    const updateAmount = (value) => {
        const originalAmount = session.amount;
        const token_amount = value * session.price;
        setRecalculatedAmount(originalAmount - token_amount);
        setTokensUsed(value);
    }

    const endSessionHandler = async () => {
        if (tokensUsed > 0) {
            dispatch(updateSession({ sessionId: session.sessionId, newData: { amount: recalculatedAmount } }))
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
            dispatch(endSession({ sessionId: session.sessionId }));
        } catch (error) {
            console.error('Request error:', error);
        } finally {
            console.log('Request completed');
        }
        dispatch(endSession({ sessionId: session.sessionId }));
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
        <>
            <div className=''>
                <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                        <tr className='hover:bg-gray-600'>
                            <td className="px-6 py-2 whitespace-nowrap">{session.customerName}</td>
                            <td className="px-6 py-2 whitespace-nowrap">{msToTime(session.plannedDuration)}</td>
                            <td className="px-6 py-2 whitespace-nowrap">{session.amount}</td>
                            <td className="px-6 py-2 whitespace-nowrap">{session.sessionType}</td>
                            <td className="px-6 py-2 whitespace-nowrap">{new Date(session.startTime).toLocaleString()}</td>
                            <td className="px-6 py-2 whitespace-nowrap">
                                <button onClick={() => handleShowPaymentForm()} className="btn btn-sm btn-secondary mr-4">Pay</button>
                                <ConfirmationModal onConfirm={() => endSessionHandler()} message="Are you sure you want to pay later?" buttonText="Pay Later" classNames="btn btn-sm btn-primary" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


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
                            <ConfirmationModal onConfirm={() => endSessionHandler()} message="Are you sure?" buttonText="Save" classNames="btn btn-sm btn-primary w-full" />
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default EndedSessionCard;
