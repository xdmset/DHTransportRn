import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import MapView, { Marker } from 'react-native-maps';
import { apiURL } from '../api/apiGlobal';

const Detail = ({ route }) => {
  const { item, extraDates } = route.params || {};
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const url = apiURL + "/api/location";
        console.log(url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const result = await response.json();

        // Encuentra la ubicación que coincida con el ID del pedido
        const locationData = result.location.find(loc =>
          loc.monitoringIds.some(monitoring =>
            monitoring.rentalId.some(rental => rental.rentalId === item.id)
          )
        );

        if (locationData) {
          setLocation({
            latitude: locationData.latitude,
            longitude: locationData.longitude,
          });
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, [item]);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se proporcionaron detalles.</Text>
      </View>
    );
  }

  const userInfo = item.rentalId[0]?.clientId[0]?.user[0] || {};
  const rentalInfo = item.rentalId[0] || {};

  const dates = extraDates || [];

  const formatDateLabel = (date) => {
    const parts = date.split(' ');
    if (parts.length >= 2) {
      const [monthDay, time] = parts;
      const [month, day] = monthDay.split('/');
      return `${month}/${day}\n${time}`;
    }
    return date;
  };

  const temperatureData = (item.temperature || []).map((temp, index) => ({
    value: temp,
    labelComponent: () => <Text style={styles.axisLabel}>{formatDateLabel(dates[index] || '')}</Text>,
  }));

  const weightData = (item.weight || []).map((weight, index) => ({
    value: weight,
    labelComponent: () => <Text style={styles.axisLabel}>{formatDateLabel(dates[index] || '')}</Text>,
  }));

  const humidityData = (item.humidity || []).map((humidity, index) => ({
    value: humidity,
    labelComponent: () => <Text style={styles.axisLabel}>{formatDateLabel(dates[index] || '')}</Text>,
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalles del Pedido</Text>
      <View style={styles.containerDetail}>
        <Text style={styles.detailText}>Cliente: {userInfo.name || ''} {userInfo.lastName || ''}</Text>
        <Text style={styles.detailText}>Email: {userInfo.email || ''}</Text>
        <Text style={styles.detailText}>Teléfono: {userInfo.phone || ''}</Text>
        <Text style={styles.detailText}>Categoría: {rentalInfo.category || ''}</Text>
        <Text style={styles.detailText}>Subtotal: ${rentalInfo.subtotal?.toFixed(2) || '0.00'}</Text>
        <Text style={styles.detailText}>IVA: ${rentalInfo.vat?.toFixed(2) || '0.00'}</Text>
        <Text style={styles.detailText}>Total: ${rentalInfo.total?.toFixed(2) || '0.00'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Gráfica de Temperatura</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={temperatureData}
          height={300}
          width={Dimensions.get('window').width - 40}
          isAnimated
          yAxisLabel=""
          xAxisLabel=""
          xAxisColor="#f0f0f0"
          yAxisColor="#f0f0f0"
          lineColor="#FF5722"
          spacing={45}
          xAxisLabelStyle={styles.axisLabel}
          yAxisLabelStyle={styles.axisLabel}
          adjustToWidth
        />
      </View>

      <Text style={styles.sectionTitle}>Gráfica de Peso</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={weightData}
          height={300}
          width={Dimensions.get('window').width - 40}
          isAnimated
          yAxisLabel=""
          xAxisLabel=""
          xAxisColor="#f0f0f0"
          yAxisColor="#f0f0f0"
          lineColor="#4CAF50"
          spacing={45}
          xAxisLabelStyle={styles.axisLabel}
          yAxisLabelStyle={styles.axisLabel}
          adjustToWidth
        />
      </View>

      <Text style={styles.sectionTitle}>Gráfica de Humedad</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={humidityData}
          height={300}
          width={Dimensions.get('window').width - 40}
          isAnimated
          yAxisLabel=""
          xAxisLabel=""
          xAxisColor="#f0f0f0"
          yAxisColor="#f0f0f0"
          lineColor="#2196F3"
          spacing={45}
          xAxisLabelStyle={styles.axisLabel}
          yAxisLabelStyle={styles.axisLabel}
          adjustToWidth
        />
      </View>

      <Text style={styles.sectionTitle}>Detalles del Contenedor</Text>
      {rentalInfo.containerIds?.map((container, index) => (
        <View key={index} style={styles.containerDetail}>
          <Text style={styles.detailText}>ID del Contenedor: {container.id || ''}</Text>
          <Text style={styles.detailText}>Capacidad Usable: {container.usableCapacity || '0'} m³</Text>
          <Text style={styles.detailText}>Capacidad por Metro: {container.capacityPerMeter || '0'} m³/m</Text>
          <Text style={styles.detailText}>Capacidad Total: {container.totalCapacity || '0'} m³</Text>
          <Text style={styles.detailText}>Precio: ${container.price?.toFixed(2) || '0.00'}</Text>
        </View>
      ))}

      {location && (
        <>
          <Text style={styles.sectionTitle}>Ubicación del Pedido</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
            </MapView>
          </View>
        </>
      )}
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
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  chartContainer: {
    marginBottom: 20,
  },
  containerDetail: {
    marginBottom: 20,
  },
  axisLabel: {
    color: 'black',
    fontSize: 8,
    textAlign: 'center',
    width: 45, // Ajustar el ancho del texto
    flexWrap: 'wrap', // Permitir que el texto se envuelva
  },
  mapContainer: {
    height: 300,
    width: Dimensions.get('window').width - 40,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
});

export default Detail;
