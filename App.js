import React from 'react';
import Navigation from './Navigation';
import { AuthProvider } from './components/AuthProvider'; 
import { CartProvider } from './context/CartContext';

// import { APIProvider } from './context/APIContext'; // Descomenta si decides usar APIProvider

export default function App() {
  return (
    //<APIProvider>  {/* Descomenta si decides usar APIProvider */}
    <CartProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </CartProvider>
    //</APIProvider>  {/* Descomenta si decides usar APIProvider */}
  );
}
