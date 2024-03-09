import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../paths'; // Assuming PATHS object is defined elsewhere

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate(PATHS.LOGIN);
  };

  const handleNavigateToCustomerList = (e) => {
    e.preventDefault();
    navigate(PATHS.CUSTOMERLIST); // Assuming PATHS.CUSTOMERLIST points to the customer list route
  };
  const handleNavigateToReports = (e) => {
    e.preventDefault();
    navigate(PATHS.REPORT); // Assuming PATHS.CUSTOMERLIST points to the customer list route
  };
  const handleNavigateToHome = (e) => {
    e.preventDefault();
    navigate(PATHS.HOME); // Assuming PATHS.CUSTOMERLIST points to the customer list route
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <button className="text-xl font-bold" onClick={(e) => handleNavigateToHome(e)}>Level Up Gaming Cafe</button>
      <div className="flex items-center space-x-4">
        <button
          className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          onClick={(e) => handleNavigateToCustomerList(e)}
        >
          Customer List
        </button>
        <button
          className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          onClick={(e) => handleNavigateToReports(e)}
        >
          Reports
        </button>
        <button
          className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
