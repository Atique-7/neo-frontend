import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Assuming you're using Redux
import { fetchTransactionsByCustomer, updateTransaction } from '../../redux/transactionSlice'
import ConfirmationModal from '../ConfirmationModal';
import { getCustomerById } from '../../redux/customerSlice';

const TransactionComponent = ({ customerId }) => {
    const dispatch = useDispatch();
    const transactions = useSelector((state) => state.transactions.filteredList);
    const [sortBy, setSortBy] = useState('latest'); // Default sort order
    const [filterBy, setFilterBy] = useState('all'); // Default filter
    const [gpay, setGpay] = useState(0);
    const [cash, setCash] = useState(0);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [transactionId, setTransactionId] = useState('')
    const [unpaidAmount, setUnpaidAmount] = useState(0)

    const handleSettleVariables = (transactionId, unpaidAmount) => {
        setTransactionId(transactionId);
        setUnpaidAmount(unpaidAmount);
        setShowPaymentForm(true);
    };

    const handleSettlePayment = () => {
        const requestData = {
            id: transactionId,
            amount_paid_online: gpay,
            amount_paid_cash: cash
        };
        const response = dispatch(updateTransaction(requestData));
        handleClosePaymentForm();
        dispatch(getCustomerById(customerId));
        dispatch(fetchTransactionsByCustomer(customerId));
   
    };

    const handleClosePaymentForm = () => {
        setTransactionId('');
        setUnpaidAmount(0);
        setGpay(0);
        setCash(0);
        setShowPaymentForm(false);
    };

    useEffect(() => {
        dispatch(fetchTransactionsByCustomer(customerId)); // Fetch on initial load
        console.log(transactions);
    }, [dispatch, customerId, sortBy, filterBy]);

    // useEffect(() => {
    //     dispatch(fetchTransactionsByCustomer(customerId));
    // }, [dispatch, customerId, sortBy, filterBy]);

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterBy(event.target.value);
    };

    // Helper for sorting
    const sortTransactions = (transactions) => {
        const sorted = [...transactions]; // Clone the array
        if (sortBy === 'latest') {
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date)); // Descending
        } else if (sortBy === 'oldest') {
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date)); // Ascending
        }
        return sorted;
    }

    // Helper for filtering
    const filterTransactions = (transactions) => {
        if (filterBy === 'paid') {
            return transactions.filter((t) => t.payment_status === 'fully_paid');
        } else if (filterBy === 'unpaid') {
            return transactions.filter((t) => t.payment_status !== 'fully_paid');
        } else {
            return transactions;
        }
    }

    const renderTransactions = () => {
        let sortedTransactions = sortTransactions(transactions);
        let filteredTransactions = filterTransactions(sortedTransactions);

        return filteredTransactions.length === 0 ? (
            <p>No transactions found.</p>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">Session Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">Total Cost</th>
                            <th scope="col" className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">Amount Unpaid</th>
                            <th scope="col" className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">Payment Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {filteredTransactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-600">
                                <td className="px-6 py-4 whitespace-nowrap">{transaction.session.session_type}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{transaction.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{transaction.total_cost}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{transaction.unpaid_amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{transaction.payment_method}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleSettleVariables(transaction.id, transaction.unpaid_amount)}
                                        disabled={transaction.payment_status === 'fully_paid'}
                                        className={`px-3 py-1 rounded-md ${transaction.payment_status === 'fully_paid' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                                    >
                                        {transaction.payment_status === 'fully_paid' ? 'Paid' : 'Settle'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showPaymentForm && (
                    <div id="container" className="fixed inset-0 bg-red bg-opacity-30 backdrop-blur-sm flex justify-center items-center w-full h-full">
                        <div className="relative bg-black p-6 rounded-lg w-80">
                            <button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2" onClick={() => handleClosePaymentForm()}>✕</button>
                            <form className="mb-4">
                                <p className="mb-2">Cost: {unpaidAmount}</p>
                                <input type="number" onChange={(e) => setGpay(e.target.value)} placeholder="GPay" className="input input-md w-full mb-2" />
                                <input type="number" onChange={(e) => setCash(e.target.value)} placeholder="Cash" className="input input-md w-full mb-2" />
                                <ConfirmationModal buttonText="save" classNames="btn btn-sm btn-primary" onConfirm={() => handleSettlePayment()} onCancel={() => handleClosePaymentForm()} message="Are you sure?" />
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    };



    return (
        <div>
            <div>
                <h2 className="text-xl font-semibold mb-4">Customer Transactions</h2>
                <div className="mb-4">
                    <label htmlFor="sort" className="mr-2 font-medium">Sort by:</label>
                    <select id="sort" value={sortBy} onChange={handleSortChange} className="rounded-md border border-gray-300 px-2 py-1">
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                    </select>

                    <label htmlFor="filter" className="ml-4 mr-2 font-medium">Filter by:</label>
                    <select id="filter" value={filterBy} onChange={handleFilterChange} className="rounded-md border border-gray-300 px-2 py-1">
                        <option value="all">All</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
                </div>
                {renderTransactions()}
            </div>
        </div>
    );
};

export default TransactionComponent;
