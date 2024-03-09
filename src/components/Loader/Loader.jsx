import "./Loader.css"
import React from 'react';

const Loader = () => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center w-full h-full">
      <div className="loader-container">
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;