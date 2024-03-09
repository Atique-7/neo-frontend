import {React, useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Login from './components/Login';
import CustomerList from './components/Customer';
import CreateCustomerForm from './pages/Customer/CreateCustomer';
import CustomerProfile from './pages/Customer/CustomerProfile';

import Home from './components/Home';
import PrivateRoutes from './routes/PrivateRoutes'
import RestrictedRoutes from './routes/RestrictedRoutes'

import { setCredentials } from './redux/authSlice';
import { PATHS } from '../paths';
import BeverageForm from './pages/Food/Beverages';
import ReportsComponent from './pages/Reports/Reports';

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setCredentials({ token }));
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<PrivateRoutes />}>
        
        <Route path={PATHS.HOME} element={<Home />} />
        <Route path={PATHS.CUSTOMERLIST} element={<CustomerList />} />
        <Route path={PATHS.CREATECUSTOMER} element={<CreateCustomerForm />} />
        <Route path={PATHS.CUSTOMERPROFILE} element={<CustomerProfile />} />
        <Route path={PATHS.BEVERAGE} element={<BeverageForm />} />
        <Route path={PATHS.REPORT} element={<ReportsComponent />} />
        
      </Route>

      <Route path="/" element={<RestrictedRoutes />}>
        <Route path={PATHS.LOGIN} element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
