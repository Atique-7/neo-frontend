import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Assuming you're using Redux
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchTransactionsByDate } from '../../redux/transactionSlice'; // Assuming you have fetchTransactionsByDate action

const ReportsComponent = () => {
  const dispatch = useDispatch();
  const todaysTransactions = useSelector((state) => state.transactions.todaysList); // Access all transactions
  const customTransactions = useSelector((state) => state.transactions.customList || []); // Access all transactions

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]); // Today's date by default
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Today's date by default

  const [totalSales, setTotalSales] = useState(0);
  const [salesByType, setSalesByType] = useState({}); // Object to store sales by type
  const [totalOnline, setTotalOnline] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [totalFlow, setTotalFlow] = useState(0);

  const [customTotalSales, setCustomTotalSales] = useState(0);
  const [customSalesByType, setCustomSalesByType] = useState({}); // Object to store sales by type
  const [customTotalOnline, setCustomTotalOnline] = useState(0);
  const [customTotalCash, setCustomTotalCash] = useState(0);
  const [customTotalUnpaid, setCustomTotalUnpaid] = useState(0);
  const [customTotalFlow, setCustomTotalFlow] = useState(0);

  useEffect(() => {
    fetchTodaysTransactions();
  }, []);

  const fetchTodaysTransactions = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Zero-pad month
    const dd = String(today.getDate()).padStart(2, '0');
    const startDate = `${yyyy}-${mm}-${dd}`;
    dispatch(fetchTransactionsByDate({ startDate: startDate, endDate: startDate, custom: false }));
  };

  const customTransactionsHandler = () => {
    dispatch(fetchTransactionsByDate({ startDate: startDate, endDate: endDate, custom: true }));
    calculateTotals(customTransactions, true);
  }

  useEffect(() => {
    calculateTotals(todaysTransactions, false);
    calculateTotals(customTransactions, true);
  }, [todaysTransactions, customTransactions]);

  const calculateTotals = (transactions, byDate) => {
    let totalSalesAmount = 0;
    const salesByTypeObj = {};
    let totalOnlineAmount = 0;
    let totalCashAmount = 0;
    let totalUnpaidAmount = 0;

    transactions.forEach((transaction) => {
        totalSalesAmount += parseFloat(transaction.total_cost);
        salesByTypeObj[transaction.session.session_type] = (salesByTypeObj[transaction.session.session_type] || 0) + parseFloat(transaction.total_cost);
        totalOnlineAmount += parseFloat(transaction.amount_paid_online);
        totalCashAmount += parseFloat(transaction.amount_paid_cash);
        totalUnpaidAmount += parseFloat(transaction.unpaid_amount);
    });

    if (byDate === false) {
        setTotalSales(totalSalesAmount);
        setSalesByType(salesByTypeObj);
        setTotalOnline(totalOnlineAmount);
        setTotalCash(totalCashAmount);
        setTotalUnpaid(totalUnpaidAmount);
        setTotalFlow(totalOnlineAmount + totalCashAmount);
    } else if (byDate === true) {
        setCustomTotalSales(totalSalesAmount);
        setCustomSalesByType(salesByTypeObj);
        setCustomTotalOnline(totalOnlineAmount);
        setCustomTotalCash(totalCashAmount);
        setCustomTotalUnpaid(totalUnpaidAmount);
        setCustomTotalFlow(totalOnlineAmount + totalCashAmount);
    }
};


  const handleDateChange = (type, date) => {
    if (type === 'start') {
      setStartDate(date.toISOString().split('T')[0]);
    } else if (type === 'end') {
      setEndDate(date.toISOString().split('T')[0]);
    }
    
  };

  const refreshData = () => {
    fetchTodaysTransactions();
  };

  return (
    <div className="font-mono p-8 rounded-md">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Sales Reports</h2>
        <div className="flex items-center">
          <button className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={refreshData}>Refresh</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Sales Stats */}
        <div className="p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-4">Sales Statistics</h3>
          <ul className="list-none space-y-2">
            <li>Total Sales: ₹{totalSales.toFixed(2)}</li>
            {Object.entries(salesByType).map(([type, amount]) => (
              <li key={type}>Sales ({type}): ₹{amount.toFixed(2)}</li>
            ))}
            <li>Total Online: ₹{totalOnline.toFixed(2)}</li>
            <li>Total Cash: ₹{totalCash.toFixed(2)}</li>
            <li>Total Unpaid: ₹{totalUnpaid.toFixed(2)}</li>
            <li>Total Flow: ₹{totalFlow.toFixed(2)}</li>
          </ul>
        </div>
      </div>
      {/* Other Reports */}
      <div className="p-4 rounded-md shadow-md mt-4">
        <h3 className="text-lg font-semibold mb-4">Other Reports</h3>
        <div className="flex items-center">
          <label htmlFor="startDate" className="mr-2">Start Date:</label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={(date) => handleDateChange('start', date)}
            dateFormat="yyyy-MM-dd"
            maxDate={endDate}
          />
          <label htmlFor="endDate" className="mx-2">End Date:</label>
          <DatePicker
            id="endDate"
            selected={endDate}
            onChange={(date) => handleDateChange('end', date)}
            dateFormat="yyyy-MM-dd"
            minDate={startDate}
          />
          <button className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => customTransactionsHandler()}>Search</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* {(customTransactions.length === 0) ? (<p>NO DATES SELECTED</p>) : ( */}
            <div className="p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-4">Sales Statistics</h3>
              <ul className="list-none space-y-2">
                <li>Total Sales: ₹{customTotalSales.toFixed(2)}</li>
                {Object.entries(customSalesByType).map(([type, amount]) => (
                  <li key={type}>Sales ({type}): ₹{amount.toFixed(2)}</li>
                ))}
                <li>Total Online: ₹{customTotalOnline.toFixed(2)}</li>
                <li>Total Cash: ₹{customTotalCash.toFixed(2)}</li>
                <li>Total Unpaid: ₹{customTotalUnpaid.toFixed(2)}</li>
                <li>Total Flow: ₹{customTotalFlow.toFixed(2)}</li>
              </ul>
            </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default ReportsComponent;
