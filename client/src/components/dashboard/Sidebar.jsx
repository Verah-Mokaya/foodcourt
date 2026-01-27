import React from "react";

const Sidebar = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 h-screen w-64 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h2>
      <ul className="flex flex-col space-y-2">
        <li>
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            Orders
          </a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            Menu Items
          </a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            Table Bookings
          </a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            Settings
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
