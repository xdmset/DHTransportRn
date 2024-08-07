// components/CartasPro.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext'; // Importa el contexto del carrito

const CartasPro = ({ id, usableCapacity, capacityPerMeter, totalCapacity, price, photo }) => {
  const navigation = useNavigation();
  const { dispatch } = useCart(); // Usa el contexto del carrito

  const addToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: { id, usableCapacity, capacityPerMeter, totalCapacity, price } });
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('Detail', { containerId: id })}>
        <Card.Cover
          style={styles.img}
          source={{ uri: photo }} // Usa una imagen de marcador de posición
        />
      </TouchableOpacity>
      <Card.Content>
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            {/*<Text style={styles.title}>Container ID: {id}</Text>*/}
            <Text style={styles.subtitle}>Usable Capacity: {usableCapacity.toFixed(2)} m³</Text>
            <Text style={styles.subtitle}>Capacity per Meter: {capacityPerMeter.toFixed(2)} m³/m</Text>
            <Text style={styles.subtitle}>Total Capacity: {totalCapacity.toFixed(2)} m³</Text>
            <Text style={styles.subtitle}>Price: ${price.toFixed(2)}</Text>
          </View>
          <Button
            icon="plus"
            mode="contained"
            onPress={addToCart}
            style={styles.button}
            labelStyle={{ color: '#000000' }} 
          >
            Add to Cart
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 8,
  },
  img: {
    height: 150,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
  button: {
    borderRadius: 20,
    marginLeft: 10, 
    backgroundColor: '#FFCD11',
    color: '#000000', 
    minWidth: 100, 
    height: 40, 
  },
});

export default CartasPro;
