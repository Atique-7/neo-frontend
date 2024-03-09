import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchTransactionsByDate } from '../../redux/transactionSlice';

const ReportsComponent = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.list);
  const filteredTransactions = useSelector((state) => state.transactions.filteredList);
  const todaysReports = useSelector((state) => state.transactions.todaysList); // New array for today's reports

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [totalSales, setTotalSales] = useState(0);
  const [salesByType, setSalesByType] = useState({});
  const [totalOnline, setTotalOnline] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [totalFlow, setTotalFlow] = useState(0);

  useEffect(() => {
    // Fetch today's transactions when the component mounts
    const today = new Date().toISOString().slice(0, 10);
    setStartDate(today);
    setEndDate(today);
    dispatch(fetchTransactionsByDate({ startDate: today, endDate: today }));
  }, [dispatch]);

  useEffect(() => {
    // Calculate totals for today's transactions
    calculateStats(transactions, setTotalSales, setSalesByType, setTotalOnline, setTotalCash, setTotalUnpaid, setTotalFlow);
  }, [transactions]);

  useEffect(() => {
    // Fetch transactions based on selected dates
    if (startDate && endDate) {
      dispatch(fetchTransactionsByDate({ startDate, endDate }));
    }
  }, [startDate, endDate, dispatch]);

  useEffect(() => {
    // Calculate totals for filtered transactions
    if (filteredTransactions.length > 0) {
      calculateStats(filteredTransactions, setTotalSales, setSalesByType, setTotalOnline, setTotalCash, setTotalUnpaid, setTotalFlow);
    } else {
      // Reset totals if no filtered transactions
      setTotalSales(0);
      setSalesByType({});
      setTotalOnline(0);
      setTotalCash(0);
      setTotalUnpaid(0);
      setTotalFlow(0);
    }
  }, [filteredTransactions]);

  useEffect(() => {
    // Calculate totals for today's reports
    calculateStats(todaysReports, setTotalSales, setSalesByType, setTotalOnline, setTotalCash, setTotalUnpaid, setTotalFlow);
  }, [todaysReports]);

  const calculateStats = (transactions, setTotalSales, setSalesByType, setTotalOnline, setTotalCash, setTotalUnpaid, setTotalFlow) => {
    let totalSalesAmount = 0;
    const salesByTypeObj = {};
    let totalOnlineAmount = 0;
    let totalCashAmount = 0;
    let totalUnpaidAmount = 0;

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getFullYear() === new Date().getFullYear() &&
          transactionDate.getMonth() === new Date().getMonth() &&
          transactionDate.getDate() === new Date().getDate()) {
        setTodayTotalSales(prevTotalSales => prevTotalSales + transaction.total_cost);
        setTodaySalesByType(prevSalesByType => {
          const updatedSalesByType = { ...prevSalesByType };
          updatedSalesByType[transaction.session.session_type] = (updatedSalesByType[transaction.session.session_type] || 0) + transaction.total_cost;
          return updatedSalesByType;
        });
        setTodayTotalOnline(prevTotalOnline => prevTotalOnline + transaction.amount_paid_online);
        setTodayTotalCash(prevTotalCash => prevTotalCash + transaction.amount_paid_cash);
        setTodayTotalUnpaid(prevTotalUnpaid => prevTotalUnpaid + transaction.unpaid_amount);
      } else {
        totalSalesAmount += transaction.total_cost;
        salesByTypeObj[transaction.session.session_type] = (salesByTypeObj[transaction.session.session_type] || 0) + transaction.total_cost;
        totalOnlineAmount += transaction.amount_paid_online;
        totalCashAmount += transaction.amount_paid_cash;
        totalUnpaidAmount += transaction.unpaid_amount;
      }
    });

    setTotalSales(totalSalesAmount);
    setSalesByType(salesByTypeObj);
    setTotalOnline(totalOnlineAmount);
    setTotalCash(totalCashAmount);
    setTotalUnpaid(totalUnpaidAmount);
    setTotalFlow(totalOnlineAmount + totalCashAmount);
  };

  const handleDateChange = (type, date) => {
    if (type === 'start') {
      setStartDate(date);
    } else if (type === 'end') {
      setEndDate(date);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between">
        <h2>Sales Reports</h2>
        <div className="flex items-center">
          <label htmlFor="startDate">Start Date:</label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={(date) => handleDateChange('start', date)}
            dateFormat="yyyy-MM-dd"
          />
          <label htmlFor="endDate" className="mx-4">End Date:</label>
          <DatePicker
            id="endDate"
            selected={endDate}
            onChange={(date) => handleDateChange('end', date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* <div className="bg-gray-100 p-4 rounded-md">
          <h3>Today's Sales Statistics</h3>
          <ul className="list-disc space-y-2">
            <li>Total Sales: ${todayTotalSales}</li>
            <li>Sales by Type:</li>
            {Object.entries(todaySalesByType).map(([type, amount]) => (
              <li key={type}>- {type}: ${amount}</li>
            ))}
            <li>Total Online: ${todayTotalOnline}</li>
            <li>Total Cash: ${todayTotalCash}</li>
            <li>Total Unpaid: ${todayTotalUnpaid}</li>
            <li>Total Flow: ${todayTotalFlow}</li>
          </ul>
        </div> */}
        <div className="bg-gray-100 p-4 rounded-md">
          <h3>Sales Statistics with Date Filter</h3>
          <ul className="list-disc space-y-2">
            <li>Total Sales: ${totalSales}</li>
            <li>Sales by Type:</li>
            {Object.entries(salesByType).map(([type, amount]) => (
              <li key={type}>- {type}: ${amount}</li>
            ))}
            <li>Total Online: ${totalOnline}</li>
            <li>Total Cash: ${totalCash}</li>
            <li>Total Unpaid: ${totalUnpaid}</li>
            <li>Total Flow: ${totalFlow}</li>
          </ul>
        </div>
        <div className="bg-gray-100 p-4 rounded-md">
          <h3>Other Reports</h3>
        </div>
      </div>
    </div>
  );
};

export default ReportsComponent;
