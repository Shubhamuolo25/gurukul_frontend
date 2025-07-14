import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import network from '../libs/network';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    const validate = async () => {
      try {
        const res = await network.get('/auth/validate');
        setIsAuthenticated(res.status === 200);
      } catch (err) {
        setIsAuthenticated(false);
        toast.error("Session expired. Please login again.");
      }
    };
    validate();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
