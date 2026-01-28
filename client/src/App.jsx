import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Menu from './pages/Menu.jsx';

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Nextgen Food Court!</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/cart">Cart</Link>

      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </Router>
  );
}

export default App;
