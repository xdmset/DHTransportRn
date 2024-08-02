import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth, AuthProvider } from '../components/AuthProvider';

const HomeScreen = () => {
  const [data, setData] = useState([]); // To store data from the API
  const [isLoading, setIsLoading] = useState(true); // To handle loading state
  const [isWrong, setIsWrong] = useState(false);

  const { user } = useAuth(); 

  function usuarioAvatar(str) {
    if (!str) return ""; 
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:5001/api/monitor');

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('API Response:', result);

        if (Array.isArray(result.monitor) && result.monitor.length > 0) {
          setData(result.monitor);
          setIsWrong(false);
        } else {
          setData([]);
          setIsWrong(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
        setIsWrong(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to extract user information and match current user
  const getUserInfo = (clientId) => {
    if (clientId && clientId.user && clientId.user.length > 0) {
      const user = clientId.user[0];
      return {
        name: `${user.name || ''} ${user.lastName || ''}`.trim(),
        id: user.id,
      };
    } else {
      return { name: 'N/A', id: null };
    }
  };

  // Filter data based on the current user
  const currentUserName = usuarioAvatar(user?.name + " "+ user?.lastName);

  const filteredData = data.filter((item) => {
    const userInfo = getUserInfo(item.rentalId[0].clientId[0]);
    return userInfo.name.includes(currentUserName);
  });

  const printData = () => {
    if (isWrong) {
      return <Text style={styles.errorText}>Hubo un error al cargar los datos.</Text>;
    }

    if (filteredData.length === 0) {
      return <Text style={styles.errorText}>No se encontraron resultados.</Text>;
    }

    return filteredData.map((item, index) => {
      const userInfo = getUserInfo(item.rentalId[0].clientId[0]);

      return (
        <View key={index} style={styles.card}>
          <Text style={styles.cardText}>Usuario: {userInfo.name}</Text>
          <Text style={styles.cardText}>ID: {item.id}</Text>
          <Text style={styles.cardText}>Fecha: {item.date}</Text>
          <Text style={styles.cardText}>Temperatura: {item.temperature}°C</Text>
          <Text style={styles.cardText}>Humedad: {item.humidity}%</Text>
          <Text style={styles.cardText}>Peso: {item.weight}kg</Text>
          {/* Add more fields as necessary */}
        </View>
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <Text style={styles.errorText}>Cargando...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {printData()}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'black',
    textAlign: 'center',
    padding: 10,
  },
  scrollView: {
    alignItems: 'center',
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    padding: 15,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default HomeScreen;
