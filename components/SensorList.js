// SensorList.js
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import Cartas from './Cartas';

const SensorList = (props) => {
  const [sensor, setSensor] = useState([]);

  useEffect(() => {
    if (props.data) {
      setSensor(props.data);
      console.log('Sensor Data:', props.data);  // Añadir este log para verificar los datos que llegan a SensorList
    }
  }, [props.data]);

  const renderItems = () => {
    if (!sensor || sensor.length === 0) return <Text>No data available</Text>;

    return sensor.map((item, index) => (
      <View key={index} style={styles.cards}>
        <Cartas
          name={item.nombre}
          lastName={item.lastName}
          startDate={item.startDate}
          category={item.category}
        />
      </View>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {renderItems()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    alignItems: 'center',
    paddingTop: 20,
  },
  cards: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
});

export default SensorList;
