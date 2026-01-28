
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OutletRegistration from './pages/OutletRegistration.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard/outlet-register" element={<OutletRegistration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
