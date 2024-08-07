import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiURL } from '../api/apiGlobal';
import CartasPro from '../components/CartasPro';

const HomeScreen = () => {
  const [containers, setContainers] = useState([]);
  const [cart, setCart] = useState(new Set());
  const navigation = useNavigation();

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const url = apiURL + "/api/container";
        console.log(url);
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 0) {
          const availableContainers = data.container.filter(container => {
            return container.status.some(status => status.id === 'DISP');
          });
          setContainers(availableContainers);
        }
      } catch (error) {
        console.error('Error fetching containers:', error);
      }
    };

    fetchContainers();
  }, []);

  const handleAddToCart = (container) => {
    setCart(prevCart => new Set(prevCart).add(container.id));
  };

  const renderItem = ({ item }) => (
    <CartasPro
      id={item.id}
      usableCapacity={item.usableCapacity}
      capacityPerMeter={item.capacityPerMeter}
      totalCapacity={item.totalCapacity}
      price={item.price}
      photo={item.photo}
      isInCart={cart.has(item.id)}
      onAddToCart={() => handleAddToCart(item)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Catalog of Containers</Text>
      <FlatList
        data={containers}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen;
