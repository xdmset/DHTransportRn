import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useCart } from '../context/CartContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiURL } from '../api/apiGlobal';
import { useAuth } from '../components/AuthProvider';

const ShoppingCartScreen = ({ navigation }) => {
  const url = apiURL + "";

  const { user } = useAuth(); 


  const { cart, removeItemFromCart } = useCart();
  const cartIsEmpty = cart.length === 0;

  const obtenerFechaMinima = () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 2);
    return fecha;
  };

  const obtenerFechaMaxima = () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 2);
    fecha.setMonth(fecha.getMonth() + 6);
    return fecha;
  };

  const [fechaInicio, setFechaInicio] = useState(obtenerFechaMinima());
  const [fechaFinal, setFechaFinal] = useState(obtenerFechaMinima());
  const fechaMin = obtenerFechaMinima();
  const fechaMax = obtenerFechaMaxima();

  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinalPicker, setShowFinalPicker] = useState(false);

  const [total, setTotal] = useState(0);
 
  //logica de RESERVA modificar very import
  useEffect(() => {
    if (!cartIsEmpty && fechaFinal >= fechaInicio) {
      const newTotal = cart.reduce((acc, item) => acc + (item.price), 0);
      setTotal(newTotal);
    }
  }, [fechaInicio, fechaFinal, cart]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleInitializeReservation = async () => {
    const postData = {
      Id: 23, // Reemplaza con los datos reales
      Category: 'container renter',
      StartDate: formatDate(fechaInicio),
      EndDate: formatDate(fechaFinal),
      Subtotal: total,
      Vat: 20.00,
      Total: 120.00,
      Container_Id: 1, // Asegúrate de que `item` esté definido y tenga `id`
      Client_Id: user.id
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
  
      const textResponse = await response.text(); // Leer respuesta como texto
      //console.log('Response text:', textResponse); // Mostrar respuesta en consola
  
      let result;
      try {
        result = JSON.parse(textResponse); // Intentar parsear como JSON
      } catch (jsonError) {
        console.error('JSON Parse error:', jsonError);
        throw new Error('Invalid JSON response');
      }
  
      if (response.ok) {
        alert(result.message || 'Reservation successful');
      } else {
        alert(result.message || 'Reservation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while making the reservation');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista del Carrito</Text>
      {cartIsEmpty ? (
        <Text style={styles.emptyMessage}>No hay nada en el carrito...</Text>
      ) : (
        <View style={styles.cartList}>
          {cart.map((item, index) => (
            <View key={item.id || index} style={styles.item}>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Container</Text>
                <Text style={styles.itemDetails}>Usable Capacity: {item.usableCapacity} m³</Text>
                <Text style={styles.itemPrice}>Price: ${item.price}</Text>
              </View>
              <TouchableOpacity
                onPress={() => removeItemFromCart(item.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      {!cartIsEmpty && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerGroup}>
              <Button title="Seleccionar Fecha de Inicio" onPress={() => setShowInicioPicker(true)} />
              {showInicioPicker && (
                <DateTimePicker
                  value={fechaInicio}
                  mode="date"
                  display="default"
                  minimumDate={fechaMin}
                  maximumDate={fechaMax}
                  onChange={(event, selectedDate) => {
                    setShowInicioPicker(false);
                    setFechaInicio(selectedDate || fechaInicio);
                  }}
                />
              )}
            </View>
            <View style={styles.datePickerGroup}>
              <Button title="Seleccionar Fecha Final" onPress={() => setShowFinalPicker(true)} />
              {showFinalPicker && (
                <DateTimePicker
                  value={fechaFinal}
                  mode="date"
                  display="default"
                  minimumDate={fechaInicio}
                  maximumDate={fechaMax}
                  onChange={(event, selectedDate) => {
                    setShowFinalPicker(false);
                    setFechaFinal(selectedDate || fechaFinal);
                  }}
                />
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={handleInitializeReservation}
            style={styles.reserveButton}
          >
            <Text style={styles.reserveButtonText}>Inicializar Reserva</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 18,
    color: "grey",
    textAlign: "center",
  },
  cartList: {
    flex: 1,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDetails: {
    fontSize: 14,
    color: "#666",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  removeButton: {
    backgroundColor: '#FFCD11',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#000',
    fontSize: 14,
  },
  totalContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePickerGroup: {
    marginBottom: 10,
  },
  reserveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShoppingCartScreen;
