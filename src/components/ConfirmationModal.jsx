import React, { useState } from 'react';

const ConfirmationModal = ({ message, onConfirm, onCancel, buttonText, classNames }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = (e) => {
        e.preventDefault();
        setIsOpen(true);
    }
    const handleClose = () => {
        //if (onCancel) onCancel();
        setIsOpen(false);
    }

    const handleConfirmation = () => {
        onConfirm();
        handleClose();
    };

    return (
        <>
            <div className={classNames}>
                <button onClick={handleOpen}>
                    {buttonText}
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-red bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-999">
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <p className="text-lg font-bold mb-2 font-mono">{message}</p>
                        <div className="flex justify-end">
                            <button onClick={() => handleClose()} className="btn btn-sm btn-secondary mr-2">
                                Cancel
                            </button>
                            <button onClick={() => handleConfirmation()} className="btn btn-sm btn-primary">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConfirmationModal;
