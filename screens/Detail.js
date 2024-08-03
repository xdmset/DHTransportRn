import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Detail = ({ route }) => {
  // Asegúrate de que 'item' esté definido
  const { item } = route.params || {};

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se proporcionaron detalles.</Text>
      </View>
    );
  }

  // Extrae la información del item
  const userInfo = item.rentalId[0].clientId[0].user[0];
  const rentalInfo = item.rentalId[0];
  const formattedDate = format(new Date(item.date), 'dd MMMM yyyy HH:mm', { locale: es });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalles del Pedido</Text>
      <View   style={styles.containerDetail}>
      <Text style={styles.detailText}>Cliente: {userInfo.name} {userInfo.lastName}</Text>
      <Text style={styles.detailText}>Email: {userInfo.email}</Text>
      <Text style={styles.detailText}>Teléfono: {userInfo.phone}</Text>
      <Text style={styles.detailText}>Fecha: {formattedDate}</Text>
      <Text style={styles.detailText}>Temperatura: {item.temperature}°C</Text>
      <Text style={styles.detailText}>Humedad: {item.humidity}%</Text>
      <Text style={styles.detailText}>Peso: {item.weight}kg</Text>
      <Text style={styles.detailText}>Categoría: {rentalInfo.category}</Text>
      <Text style={styles.detailText}>Subtotal: ${rentalInfo.subtotal.toFixed(2)}</Text>
      <Text style={styles.detailText}>IVA: ${rentalInfo.vat.toFixed(2)}</Text>
      <Text style={styles.detailText}>Total: ${rentalInfo.total.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Detalles del Contenedor</Text>
      {rentalInfo.containerIds.map((container, index) => (
        <View key={index} style={styles.containerDetail}>
          <Text style={styles.detailText}>ID del Contenedor: {container.id}</Text>
          <Text style={styles.detailText}>Capacidad Usable: {container.usableCapacity} m³</Text>
          <Text style={styles.detailText}>Capacidad por Metro: {container.capacityPerMeter} m³/m</Text>
          <Text style={styles.detailText}>Capacidad Total: {container.totalCapacity} m³</Text>
          <Text style={styles.detailText}>Precio: ${container.price.toFixed(2)}</Text>
        </View>
      ))}
      {/* Añadir más campos si es necesario */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  containerDetail: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default Detail;
