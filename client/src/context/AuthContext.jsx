import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:4000/users');
      const users = await res.json();
      const foundUser = users.find(u => u.email === email && u.password === password);
      if (foundUser) {
        setUser(foundUser);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
