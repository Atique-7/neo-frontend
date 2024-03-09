// SessionForm.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomerList, addSession } from '../../redux/sessionSlice';
import Select from 'react-select';
import API from '../../utils/api';
import { fetchBeverages } from '../../redux/beverageSlice';
import { createSale } from '../../redux/salesSlice';
import ConfirmationModal from '../../components/ConfirmationModal';

const BeverageForm = () => {

    const [gpay, setGpay] = useState(0);
    const [cash, setCash] = useState(0);
    const [amount, setAmount] = useState(0);
    const [cost, setCost] = useState(0);

    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const handleShowPaymentForm = (e) => {
        e.preventDefault();
        setShowPaymentForm(true);
    };

    const handleClosePaymentForm = () => {
        setShowPaymentForm(false);
    };


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
        dispatch(fetchBeverages())
    }, []);

    const [sessionFormData, setSessionFormData] = useState({
        customer: '',
        beverage: '',
        quantity: 0,
    });

    const dispatch = useDispatch();
    const customerList = useSelector((state) => state.sessio?.customerList);
    const beverageList = useSelector((state) => state.beverage.beverages);
    const memoizedCustomerList = useMemo(() => customerList || [], [customerList]);
    const memoizedBeverageList = useMemo(() => beverageList || [], [beverageList]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSessionFormData({ ...sessionFormData, [name]: value });
    };

    const handleCustomerInputChange = (e) => {
        console.log(e.value)
        setSessionFormData({ ...sessionFormData, 'customer': e.value });
    };
    const handleBeverageInputChange = (e) => {
        console.log(e.value)
        setSessionFormData({ ...sessionFormData, 'beverage': e.value.id });
        console.log(e.value.price)
        const price = e.value.price
        setCost(price)
        console.log(cost)
    };

    const handleFormSubmit = async () => {
      
        console.log("ran")
        try {
            let requestData = {
                customer: sessionFormData.customer,
                beverage: sessionFormData.beverage,
                quantity: sessionFormData.quantity,
                gpay: gpay,
                cash: cash,
            };

            response = dispatch(createSale({ saleData: requestData }));
            console.log(response)

            if (response.status === 201) {
                console.log(response)
                setSessionFormData({
                    customer: '',
                    beverage: '',
                    quantity: 0,
                });
            } else {
                console.error('Error creating session:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    return (
        <div className="flex justify-center font-md my-20 font-mono">
        
                <div className="m-10 space-y-4">
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

                    <label className="block text-gray-100 mb-2">Beverage:</label>
                    <Select
                        name='customer'
                        options={memoizedBeverageList.map(beverage => ({ value: {id: beverage.id, price: beverage.price}, name: beverage.name, label: beverage.name }))}
                        onChange={handleBeverageInputChange}
                        placeholder="Select a Beverage"
                        className='mb-2 text-gray-700'
                        isSearchable={true}
                        maxMenuHeight={120}
                        menuPlacement="auto"
                    />

                    <label className="block ">
                        <p className="text-gray-100 mb-2">Quantity:</p>
                        <input
                            type="number"
                            name="quantity"
                            value={sessionFormData.quantity}
                            onChange={handleInputChange}
                            min="1"
                            step="1"
                            className="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </label>
                    <div className="flex mb-4">
                        <button onClick={(e) => handleShowPaymentForm(e)} className="btn btn-sm btn-secondary mr-2">Pay</button>
                        <ConfirmationModal onConfirm={() => endPaymentHandler()} message="Are you sure you want to pay later?" buttonText="Pay Later" classNames="btn btn-sm btn-primary " />
                    </div>
                    {showPaymentForm && (
                        <div id="container" className="fixed inset-0 bg-red bg-opacity-30 backdrop-blur-sm flex justify-center items-center w-full h-full">
                            <div className="relative bg-black p-6 rounded-lg w-80">
                                <button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2" onClick={() => handleClosePaymentForm()}>✕</button>
                                <form className="mb-4">
                                    <p className="mb-2">Cost: {cost}</p>
                                    <input type="number" onChange={(e) => setGpay(e.target.value)} placeholder="GPay" className="input input-md w-full mb-2" />
                                    <input type="number" onChange={(e) => setCash(e.target.value)} placeholder="Cash" className="input input-md w-full mb-2" />
                                    <ConfirmationModal onConfirm={handleFormSubmit} message="Are you sure?" buttonText="Save" classNames="btn btn-sm btn-primary w-full" />
                                </form>
                            </div>
                        </div>
                    )}
                </div>
        </div>

    );
};

export default BeverageForm;
