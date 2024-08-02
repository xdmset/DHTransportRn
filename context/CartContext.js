// CartContext.js
import React, { createContext, useReducer, useContext } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Verificar si el artículo ya está en el carrito
      const isItemInCart = state.some(item => item.id === action.payload.id);
      if (!isItemInCart) {
        // Si no está en el carrito, lo añade
        return [...state, action.payload];
      }
      // Si el artículo ya está en el carrito, retorna el estado actual sin cambios
      return state;
    case 'REMOVE_FROM_CART':
      // Usa 'id' para identificar el artículo a remover
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
};

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const removeItemFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  return (
    <CartContext.Provider value={{ cart, dispatch, removeItemFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
