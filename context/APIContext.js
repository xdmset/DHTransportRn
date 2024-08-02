//context/apiContext
import React, { createContext, useState, useContext } from 'react';

// Crea el contexto
const APIContext = createContext();

// componente proveedor 
export const APIProvider = ({ children }) => {
  //la IP de tu servidor API
  const [apiIP, setApiIP] = useState('http://172.18.7.81:80');

  return (
    <APIContext.Provider value={{ apiIP, setApiIP }}>
      {children}
    </APIContext.Provider>
  );
};

// Crea un hook para usar el contexto
export const useAPI = () => useContext(APIContext);

//tanto pedo y no se ocupo att Mr