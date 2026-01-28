
import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar.jsx';

export default function OutletRegistration() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [owner, setOwner] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Outlet Registration (mock):', { name, location, owner });
  };

  return (
    <div style={{ display: 'flex', minHeight: '80vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px' }}>
        <h2>Register New Outlet</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}
        >
          <input placeholder='Outlet Name' value={name} onChange={e => setName(e.target.value)} />
          <input placeholder='Location' value={location} onChange={e => setLocation(e.target.value)} />
          <input placeholder='Owner Name' value={owner} onChange={e => setOwner(e.target.value)} />
          <button type='submit'>Register Outlet</button>
        </form>
      </main>
    </div>
  );
}
