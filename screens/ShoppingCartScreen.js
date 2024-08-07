import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useCart } from '../context/CartContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiURL } from '../api/apiGlobal';
import { useAuth } from '../components/AuthProvider';

const ShoppingCartScreen = ({ navigation }) => {
  const rentalUrl = apiURL + "/api/rental";
  const clientUrl = apiURL + "/api/client";
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

  const [subtotal, setSubTotal] = useState(0);
  const [highestId, setHighestId] = useState(0);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    if (!cartIsEmpty && fechaFinal >= fechaInicio) {
      const newSubTotal = cart.reduce((acc, item) => acc + (item.price), 0);
      setSubTotal(newSubTotal);
    }
  }, [fechaInicio, fechaFinal, cart]);

  useEffect(() => {
    const fetchHighestId = async () => {
      try {
        const response = await fetch(rentalUrl);
        const data = await response.json();
        if (data.status === 0 && Array.isArray(data.rental)) {
          const ids = data.rental.map(rental => rental.rentalId);
          const maxId = Math.max(...ids);
          setHighestId(maxId);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching highest ID:', error);
      }
    };

    fetchHighestId();
  }, []);

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await fetch(clientUrl);
        const data = await response.json();
        if (data.status === 0 && Array.isArray(data.client)) {
          const client = data.client.find(client => client.user.some(u => u.id === user.id));
          if (client) {
            setClientId(client.clientId);
          } else {
            console.error('Client ID not found for user:', user.id);
          }
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching client ID:', error);
      }
    };

    fetchClientId();
  }, [user.id]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const iva = subtotal * 0.16;

  const handleInitializeReservation = async () => {
    if (clientId === null) {
      console.error('Client ID is not set');
      return;
    }

    const newId = highestId + 1;
    const postData = {
      Id: newId,
      Category: 'container rental',
      StartDate: formatDate(fechaInicio),
      EndDate: formatDate(fechaFinal),
      Subtotal: subtotal,
      Vat: iva,
      Total: subtotal + iva,
      Container_Id: cart[0]?.id, // Asegúrate de que `cart` no esté vacío
      Client_Id: clientId
    };

    try {
      const response = await fetch(rentalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      const textResponse = await response.text();
      let result;
      try {
        result = JSON.parse(textResponse);
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
          <Text style={styles.totalText}>Total: ${subtotal.toFixed(2)}</Text>
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
    backgroundColor: '#1191D4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  totalContainer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#e6e6e6",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  datePickerGroup: {
    flex: 1,
    alignItems: "center",
  },
  reserveButton: {
    backgroundColor: "#1191D4",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    minWidth: "80%",
  },
  reserveButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ShoppingCartScreen;
