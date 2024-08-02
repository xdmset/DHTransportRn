// Cartas.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Cartas = ({ name, lastName, startDate, category }) => {
  return (
    <View style={styles.card}>
      <Text>Nombre: {name}</Text>
      <Text>Apellido: {lastName}</Text>
      <Text>Fecha de Inicio: {startDate}</Text>
      <Text>Categoría: {category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
  },
});

export default Cartas;
