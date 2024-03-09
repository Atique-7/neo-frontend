import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { searchCustomers, getCustomerById} from '../redux/customerSlice'; // Assuming a customerSlice file
import { Link } from 'react-router-dom'; // Assuming using React Router for user creation
import Loader from './Loader/Loader';
import { PATHS } from '../../paths';

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const customers = useSelector((state) => state.customers.list);
  const dispatch = useDispatch();
  const searchTimeoutRef = useRef(null); // Ref to hold the timeout
  const isLoading = useSelector((state) => state.customers.loading); // Access loading state

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    clearTimeout(searchTimeoutRef.current); // Clear any ongoing timeout

    searchTimeoutRef.current = setTimeout(() => {
      if (searchTerm.length > 0) {
        dispatch(searchCustomers(searchTerm)); // Dispatch search action
      } else {
        dispatch(searchCustomers([])); // Dispatch empty array to clear results
      }
    }, 500);
  };

  const handleCustomerClick = (customerId) => {
    dispatch(getCustomerById(customerId)); // Dispatch fetch action on click
  };

  return (
    <div className="flex flex-col h-screen">
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <input
            type="text"
            placeholder="Search by Username"
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-auto"
            value={searchTerm}
            onChange={handleSearchChange}
        />
        <Link to={PATHS.CREATECUSTOMER} className="btn btn-primary">Create User</Link>
    </div>
    {searchTerm.length === 0 ? (
        <div className="text-center p-4">Search something to see results</div>
    ) : (
        <div className="flex flex-wrap p-4 overflow-y-auto font-mono">
            {customers.map((customer) => (
                <Link
                    to={`/customers/${customer.id}`}
                    key={customer.id}
                    className="m-2 p-4 rounded-md shadow-lg bg-gray-700 hover:bg-gray-100"
                    onClick={() => handleCustomerClick(customer.id)}
                >
                    <h3 className="text-lg font-bold">{customer.name}</h3>
                    <p>Username:{customer.username}</p>
                    <p>Debt:{customer.debt}</p>
                </Link>
            ))}
        </div>
    )}
    {isLoading && <Loader />}
</div>
  );
};

export default CustomerList;
