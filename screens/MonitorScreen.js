// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../components/AuthProvider';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { apiURL } from '../api/apiGlobal';


const MonitorScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [initialWeights, setInitialWeights] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isWrong, setIsWrong] = useState(false);
  const [alertShown, setAlertShown] = useState(false);

  // Nueva variable para guardar el array de fechas
  const [extraDates, setExtraDates] = useState(new Map());

  const { user } = useAuth();

  function usuarioAvatar(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = apiURL + "/api/monitor";
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const result = await response.json();
        console.log('API Response:', result);
        if (Array.isArray(result.monitor) && result.monitor.length > 0) {
          setData(result.monitor);

          // Inicializar los pesos
          const weights = new Map();
          result.monitor.forEach(item => {
            if (item.weight && item.weight.length > 0) {
              weights.set(item.id, item.weight[item.weight.length - 1]);
            }
          });
          setInitialWeights(weights);

          // Inicializar las fechas adicionales
          const datesMap = new Map();
          result.monitor.forEach(item => {
            if (item.date && item.date.length > 0) {
              datesMap.set(item.id, item.date);
            }
          });
          setExtraDates(datesMap);
          console.log(datesMap);

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

  useEffect(() => {
    // Verifica y muestra alerta si hay una temperatura mayor a 48.2°C
    const highTemperatureItems = data.filter(item => item.temperature && item.temperature.some(temp => temp > 48.2));
    if (highTemperatureItems.length > 0 && !alertShown) {
      Alert.alert("Alerta", "Se han detectado temperaturas superiores a 48.2°C.");
      setAlertShown(true);
    }

    // Verifica y muestra alerta si el peso ha cambiado
    data.forEach(item => {
      if (initialWeights.has(item.id) && item.weight && item.weight.length > 0) {
        const initialWeight = initialWeights.get(item.id);
        if (item.weight[item.weight.length - 1] !== initialWeight) {
          Alert.alert("Alerta", `El peso del contenedor con ID ${item.id} ha cambiado.`);
          // Opcionalmente, puedes eliminar el ítem del Map después de alertar
          initialWeights.delete(item.id);
        }
      }
    });
  }, [data, alertShown, initialWeights]);

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

  const currentUserName = usuarioAvatar(user?.name + " " + user?.lastName);

  const filteredData = data.filter((item) => {
    if (item.rentalId && item.rentalId[0] && item.rentalId[0].clientId && item.rentalId[0].clientId[0]) {
      const userInfo = getUserInfo(item.rentalId[0].clientId[0]);
      return userInfo.name.includes(currentUserName);
    }
    return false;
  });

  const handlePress = (item) => {
    // Pasar tanto el ítem como el array de fechas adicionales a la pantalla de detalles
    navigation.navigate('Detail', { item, extraDates: extraDates.get(item.id) || [] });
  };

  const printData = () => {
    if (isWrong) {
      return <Text style={styles.errorText}>Hubo un error al cargar los datos.</Text>;
    }

    if (filteredData.length === 0) {
      return <Text style={styles.errorText}>No se encontraron resultados.</Text>;
    }

    return filteredData.map((item, index) => {
      const userInfo = getUserInfo(item.rentalId[0]?.clientId[0]);

      // Manejar startDate
      let formattedStartDate = 'Fecha inválida';
      if (item.rentalId && item.rentalId[0] && item.rentalId[0].startDate) {
        try {
          const date = parseISO(item.rentalId[0].startDate);
          formattedStartDate = format(date, 'dd MMMM yyyy HH:mm', { locale: es });
        } catch (error) {
          console.error('Error parsing startDate:', error);
        }
      }

      // Obtener los últimos valores registrados
      const latestTemperature = item.temperature ? item.temperature[item.temperature.length - 1] : 'N/A';
      const latestHumidity = item.humidity ? item.humidity[item.humidity.length - 1] : 'N/A';
      const latestWeight = item.weight ? item.weight[item.weight.length - 1] : 'N/A';

      return (
        <TouchableOpacity key={index} style={styles.card} onPress={() => handlePress(item)}>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>Id de renta: <Text style={styles.cardTextBold}>{item.id}</Text></Text>
            <Text style={styles.cardText}>Fecha de inicio: <Text style={styles.cardTextBold}>{formattedStartDate}</Text></Text>
            <Text style={styles.cardText}>Temperatura: <Text style={styles.cardTextBold}>{latestTemperature}°C</Text></Text>
            <Text style={styles.cardText}>Humedad: <Text style={styles.cardTextBold}>{latestHumidity}%</Text></Text>
            <Text style={styles.cardText}>Peso: <Text style={styles.cardTextBold}>{latestWeight}kg</Text></Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.greetingText}>Hola {currentUserName}, estos son tus contenedores:</Text>
          {printData()}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingText: {
    color: '#1191D4',
    textAlign: 'center',
    padding: 20,
    fontSize: 18,
  },
  errorText: {
    color: '#1191D4',
    textAlign: 'center',
    padding: 20,
    fontSize: 18,
  },
  scrollView: {
    alignItems: 'center',
    paddingTop: 20,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
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
  cardContent: {
    padding: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5,
  },
  cardTextBold: {
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default MonitorScreen;
