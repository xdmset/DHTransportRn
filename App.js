
//App.js
import React from 'react';
import Navigation from './Navigation';
import { AuthProvider } from './components/AuthProvider'; 
import { CartProvider } from './context/CartContext';

//import { APIProvider } from './context/APIContext';

export default function App() {
  return (
    //<APIProvider>
      <AuthProvider>
       
          <Navigation />
       
      </AuthProvider>
    //</APIProvider>
  );
}