import React, { createContext, useContext } from 'react';

// Crea el contexto
export const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  email: localStorage.getItem('email') || null,
  name: localStorage.getItem('name') || null, // Incluyendo nn\
  id: localStorage.getItem('id') || null,
  
};



export const useAuth = () => useContext(AuthContext);