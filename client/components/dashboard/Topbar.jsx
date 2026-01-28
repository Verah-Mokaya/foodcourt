
import React from "react";

const Topbar = () => {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span>Welcome!!</span>
        <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
