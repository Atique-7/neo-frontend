import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TransactionComponent from '../../components/Transactions/Transactions';

const CustomerProfile = () => {
    const { customerId } = useParams();
    const customer = useSelector((state) => state.customers.selectedCustomer);
    const isLoading = useSelector((state) => state.customers.loading);
    const navigate = useNavigate();

    //   useEffect(() => {
    //     if (customer.id != customerId) {
    //       navigate('/customers'); // Handle missing or incorrect customer data
    //     }
    //   }, []);

    return (
        <div className="container px-4 pb-20">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="rounded-lg mx-20 shadow-lg p-4 font-mono">
                    <h2 className="text-2xl font-bold mb-4">Customer Profile</h2>
                    {(customer.id_proof != null) ? (
                        <img
                            src={customer.id_proof}
                            alt={customer.name}
                            className="w-24 h-20 mr-4 mb-10 object-cover"
                        />
                    ) : (
                        <div className="w-24 h-20 mb-10 bg-gray-200 flex items-center justify-center">
                            <span className="text-sm">Null</span>
                        </div>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-2 border shadow-lg border-gray-200 rounded-md">
                            <h3 className="font-semibold ">Name:</h3>
                            <span>{customer.name}</span>
                        </div>
                        <div className="p-2 border shadow-lg border-gray-200 rounded-md">
                            <h3 className="font-semibold">Username:</h3>
                            <span>{customer.username}</span>
                        </div>
                        <div className="p-2 border shadow-lg border-gray-200 rounded-md">
                            <h3 className="font-semibold">Debt:</h3>
                            <span>{customer.debt}</span>
                        </div>
                        <div className="p-2 border shadow-lg  border-gray-200 rounded-md">
                            <h3 className="font-semibold">PS4 Tokens:</h3>
                            <span>{customer.ps4_tokens}</span>
                        </div>
                        <div className="p-2 border shadow-lg border-gray-200 rounded-md">
                            <h3 className="font-semibold">PS5 Tokens:</h3>
                            <span>{customer.ps5_tokens}</span>
                        </div>
                    </div>
                </div>
            )}
            <div className="rounded-lg mx-10 shadow-lg p-4 text-md font-bold font-mono">
                <TransactionComponent customerId={customerId} />
            </div>
        </div>
    );
};

export default CustomerProfile;
