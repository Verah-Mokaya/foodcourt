import React from 'react';
import { Link } from 'react-router-dom';


export default function Sidebar() {
return (
<aside style={{ width: '250px', padding: '20px', background: '#f5f5f5', borderRight: '1px solid #ccc' }}>
<h3>Dashboard Menu</h3>
<ul style={{ listStyle: 'none', padding: 0 }}>
<li><Link to='/dashboard'>Dashboard Home</Link></li>
<li><Link to='/dashboard/outlet-register'>Outlet Registration</Link></li>
</ul>
</aside>
);
}