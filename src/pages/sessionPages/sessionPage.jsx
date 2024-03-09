// SessionForm.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomerList, addSession } from '../../redux/sessionSlice';
import Select from 'react-select';
import API from '../../utils/api';


const SessionForm = ({ sessionType, visible, onClose }) => {

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await API.get('/customers/');
        dispatch(setCustomerList(response.data));
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  const [sessionFormData, setSessionFormData] = useState({
    customer: '',
    plannedDuration: 0,
    frames: 0,
  });

  const dispatch = useDispatch();
  const customerList = useSelector((state) => state.sessio?.customerList);
  const memoizedCustomerList = useMemo(() => customerList || [], [customerList]);

  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose();
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSessionFormData({ ...sessionFormData, [name]: value });
  };

  const handleCustomerInputChange = (e) => {
    console.log(e.value)
    setSessionFormData({ ...sessionFormData, 'customer': e.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!sessionFormData.customer) return;
    console.log(sessionFormData.customer);

    try {
      let requestData = {};

      if (sessionFormData.frames >= 1) {
        requestData = {
          customer: sessionFormData.customer,
          session_type: sessionType,
          frame: true
        };
      } else {
        requestData = {
          customer: sessionFormData.customer,
          session_type: sessionType,
          frame: false
        };
      }

      const response = await API.post('session/', requestData);

      if (response.status === 201) {
        const newSession = response.data;
        const customer = memoizedCustomerList.find(item => item.id == sessionFormData.customer);
        console.log(customer)

        if (sessionFormData.frames >= 1) {
          dispatch(addSession({
            customerId: sessionFormData.customer,
            customerUniqueId: customer.username,
            customerName: customer.name,
            sessionType: sessionType,
            sessionId: newSession.session_id,
            price: newSession.price_per_frame,
            isSessionStarted: false,
            isSessionEnding: false,
            remainingTime: sessionFormData.frames * (newSession.duration_minutes * 60000),
            frame: true,
            frames: sessionFormData.frames,
            amount: 0,
            startTime: 0,
            endTime:0,
            sessionEnded: false,
            plannedDuration: sessionFormData.frames * (newSession.duration_minutes * 60000)
          }));
        }
        else {
          console.log("ran")
          dispatch(addSession({
            customerId: sessionFormData.customer,
            customerUniqueId: customer.username,
            customerName: customer.name,
            sessionType: sessionType,
            sessionId: newSession.session_id,
            price: newSession.price_per_unit,
            isSessionStarted: false,
            isSessionEnding: false,
            remainingTime: sessionFormData.plannedDuration * 60000,
            amount: 0,
            startTime: 0,
            endTime:0,
            sessionEnded: false,
            plannedDuration: sessionFormData.plannedDuration * 60000,
            tokensAvailable: newSession.tokens_available
          }));
        }
        // onClose();
        setSessionFormData({
          customer: '',
          plannedDuration: 0,
          frames: 0,
        });
        console.log('Session created successfully:', newSession);
      } else {
        console.error('Error creating session:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  if (!visible) return null;

  return (
    <div>
      <div onClick={handleOnClose} id="container" className="font-mono font-bold fixed inset-0 bg-red bg-opacity-30 backdrop-blur-sm flex justify-center items-center w-m">
        <div className="relative bg-black">
          <button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2" onClick={onClose}>✕</button>
          {(sessionType === "PS5" || sessionType === "PS4") && (
            <form className="m-10 space-y-4">
              <label className="block text-gray-100 mb-2">Customer:</label>
              <Select
                name='customer'
                options={memoizedCustomerList.map(customer => ({ value: customer.id, username: customer.username, label: customer.username }))}
                onChange={handleCustomerInputChange}
                placeholder="Select a customer"
                className='mb-2 text-gray-700'
                isSearchable={true}
                maxMenuHeight={120}
                menuPlacement="auto"
              />

              <label className="block ">
                <p className="text-gray-100 mb-2">Duration (in minutes):</p>
                <input
                  type="number"
                  name="plannedDuration"
                  value={sessionFormData.plannedDuration}
                  onChange={handleInputChange}
                  min="30"
                  step="30"
                  className="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </label>

              <button
                type="button"
                onClick={(e) => handleFormSubmit(e)}
                className="block w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Start Session
              </button>
            </form>
          )}
          {
            (sessionType === "Snooker" || sessionType === "Pool") && (
              <form className="m-10 space-y-4">
                <label className="block text-gray-100 mb-2">Customer:</label>
                <Select
                  name='customer'
                  options={memoizedCustomerList.map(customer => ({ value: customer.id, username: customer.username, label: customer.username }))}
                  onChange={handleCustomerInputChange}
                  placeholder="Select a customer"
                  className='mb-2 text-gray-700'
                  isSearchable={true}
                  maxMenuHeight={120}
                  menuPlacement="auto"
                />

                <label className="block ">
                  <p className="text-gray-100 mb-2">Duration (in minutes):</p>
                  <input
                    type="number"
                    name="plannedDuration"
                    value={sessionFormData.plannedDuration}
                    onChange={handleInputChange}
                    min="30"
                    step="30"
                    className={`block w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 ${sessionFormData.frames ? "disabled" : ""
                      }`}
                    disabled={sessionFormData.frames}
                  />
                </label>

                <label className="block ">
                  <p className="text-gray-100 mb-2">Frames:</p>
                  <input
                    type="number"
                    name="frames"
                    value={sessionFormData.frames}
                    onChange={handleInputChange}
                    min="1"
                    className={`block w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 ${sessionFormData.plannedDuration ? "disabled" : ""
                      }`}
                    disabled={sessionFormData.plannedDuration}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="block w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  Start Session
                </button>
              </form>
            )}
        </div>
      </div>
    </div>

  );
};

export default SessionForm;
