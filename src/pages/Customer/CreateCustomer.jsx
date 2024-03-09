import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createUser } from '../../redux/customerSlice';
import { useNavigate } from 'react-router-dom';

const CreateCustomerForm = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [idProof, setIdProof] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [notes, setNotes] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('username', username);
        if (idProof) { // Check if idProof is not null
            formData.append('id_proof', idProof);
          }
        formData.append('phone_number', phoneNumber);
        formData.append('notes', notes);

        try {
            const response = dispatch(createUser(formData));
            console.log("itifnpwenfpwbfjpbi");
            navigate('/customers');
            setName('');
            setUsername('');
            setIdProof(null);
            setPhoneNumber('');
            setNotes('');
        } catch (error) {
            // Handle submission error
        }
    };

    return (
        <div className="flex justify-center font-md my-20 font-mono">
            <form onSubmit={handleSubmit} className="shadow-lg rounded px-8 py-2">
                <div className="mb-4">
                    <label htmlFor="name" className="block">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="idProof" className="block text-sm font-medium">
                        ID Proof (Optional)
                    </label>
                    <input
                        type="file"
                        name="id_proof"
                        id="idProof"
                        onChange={(e) => setIdProof(e.target.files[0])}
                        className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phoneNumber" className="block">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        name="phone_number"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-10">
                    <label htmlFor="notes" className="block">
                        Notes (Optional)
                    </label>
                    <textarea
                        name="notes"
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-center mb-4">
                <button
                    type="submit"
                    className="py-3 text-center px-6 btn rounded-md hover:bg-gray-700"
                >
                    Create User
                </button>
                </div>
            </form>
        </div>

    );
};

export default CreateCustomerForm;
