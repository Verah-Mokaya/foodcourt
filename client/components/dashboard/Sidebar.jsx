import React from "react";

const Sidebar = () => {
  return (
    <div className="bg-light vh-100 p-3" style={{ width: '250px' }}>
      <h4>Dashboard</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <a className="nav-link" href="#">Orders</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Menu Items</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Table Bookings</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Settings</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
