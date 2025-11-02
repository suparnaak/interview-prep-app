import React from 'react';

const Loader = ({ size = 'w-6 h-6', color = 'border-indigo-600' }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin-slow rounded-full ${size} border-2 border-gray-300 ${color} border-t-transparent`}
      ></div>
    </div>
  );
};

export default Loader;
