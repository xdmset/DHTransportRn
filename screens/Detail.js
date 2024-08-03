import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LineChart } from 'react-native-gifted-charts';

const Detail = ({ route }) => {
  const { item } = route.params || {};

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se proporcionaron detalles.</Text>
      </View>
    );
  }

  const userInfo = item.rentalId[0].clientId[0].user[0];
  const rentalInfo = item.rentalId[0];
  const formattedDate = format(new Date(item.date), 'dd MMMM yyyy HH:mm', { locale: es });

  const customDataPoint = () => {
    return (
      <View
        style={{
          width: 10,
          height: 10,
          backgroundColor: 'white',
          borderWidth: 2,
          borderRadius: 5,
          borderColor: '#FF5722',
        }}
      />
    );
  };

  const customLabel = (val) => {
    return (
      <View style={{ width: 60, marginLeft: 10 }}>
        <Text style={{ color: '#FF5722', fontWeight: 'bold' }}>{val}</Text>
      </View>
    );
  };

  const temperatureData = [
    {
      value: item.temperature,
      customDataPoint: customDataPoint,
      labelComponent: () => customLabel('Temp'),
    },
  ];

  const weightData = [
    {
      value: item.weight,
      customDataPoint: customDataPoint,
      labelComponent: () => customLabel('Peso'),
    },
  ];

  const humidityData = [
    {
      value: item.humidity,
      customDataPoint: customDataPoint,
      labelComponent: () => customLabel('Humedad'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalles del Pedido</Text>
      <View style={styles.containerDetail}>
        <Text style={styles.detailText}>Cliente: {userInfo.name} {userInfo.lastName}</Text>
        <Text style={styles.detailText}>Email: {userInfo.email}</Text>
        <Text style={styles.detailText}>Teléfono: {userInfo.phone}</Text>
        <Text style={styles.detailText}>Fecha: {formattedDate}</Text>
        <Text style={styles.detailText}>Categoría: {rentalInfo.category}</Text>
        <Text style={styles.detailText}>Subtotal: ${rentalInfo.subtotal.toFixed(2)}</Text>
        <Text style={styles.detailText}>IVA: ${rentalInfo.vat.toFixed(2)}</Text>
        <Text style={styles.detailText}>Total: ${rentalInfo.total.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Gráfica de Temperatura</Text>
      <View style={styles.chartContainer}>
        <LineChart
          thickness={6}
          color="#FF5722"
          maxValue={48.2} 
          noOfSections={5} 
          data={temperatureData}
          curved
          startFillColor={'rgba(255, 87, 34, 0.3)'}
          endFillColor={'rgba(255, 87, 34, 0.1)'}
          startOpacity={0.9}
          endOpacity={0.7}
          spacing={40}
          backgroundColor="#ffffff"
          rulesColor="gray"
          yAxisTextStyle={{ color: 'black' }}
          xAxisTextStyle={{ color: 'black' }}
        />
      </View>

      <Text style={styles.sectionTitle}>Gráfica de Peso</Text>
      <View style={styles.chartContainer}>
        <LineChart
          thickness={6}
          color="#4CAF50"
          maxValue={80} 
          noOfSections={4} 
          data={weightData}
          curved
          startFillColor={'rgba(76, 175, 80, 0.3)'}
          endFillColor={'rgba(76, 175, 80, 0.1)'}
          startOpacity={0.9}
          endOpacity={0.7}
          spacing={40}
          backgroundColor="#ffffff"
          rulesColor="gray"
          yAxisTextStyle={{ color: 'black' }}
          xAxisTextStyle={{ color: 'black' }}
        />
      </View>

      <Text style={styles.sectionTitle}>Gráfica de Humedad</Text>
      <View style={styles.chartContainer}>
        <LineChart
          thickness={6}
          color="#2196F3"
          maxValue={80} 
          noOfSections={4} 
          data={humidityData}
          curved
          startFillColor={'rgba(33, 150, 243, 0.3)'}
          endFillColor={'rgba(33, 150, 243, 0.1)'}
          startOpacity={0.9}
          endOpacity={0.7}
          spacing={40}
          backgroundColor="#ffffff"
          rulesColor="gray"
          yAxisTextStyle={{ color: 'black' }}
          xAxisTextStyle={{ color: 'black' }}
        />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: 'black',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  containerDetail: {
    marginBottom: 27,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chartContainer: {
    marginBottom: -2,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 300,  
  },
});

export default Detail;
