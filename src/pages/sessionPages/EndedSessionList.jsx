import { msToTime } from '../../utils/utilFunctions';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSession, endSession, deleteSession } from '../../redux/sessionSlice';
import ConfirmationModal from '../../components/ConfirmationModal';

const EndedSessionCard = ({ session }) => {

    const endedSessions = useSelector(state => state.sessio.endedSessions || []);

    return (
        <>
            <div className="mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planned Duration</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount to be Paid</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Started</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        
                    </tbody>
                </table>
            </div>
          
        </>
    );
};

export default EndedSessionCard;
