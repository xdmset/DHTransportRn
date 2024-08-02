import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { apiURL } from '../api/apiGlobal'; // Importar apiURL desde apiGlobal

const Detail = () => {
  const route = useRoute();
  const { code } = route.params;

  const [respuesta, setRespuesta] = useState([]);

  useEffect(() => {
    const realizarSolicitudPost = async () => {
      const data = {
        codigo: code,
      };

      try {
        const response = await axios.post(`${apiURL}/rayApi/loginExample/getAllMachine.php`, data); // Usar apiURL de apiGlobal
        setRespuesta(response.data);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    if (code) {
      realizarSolicitudPost();
    }
  }, [code]);

  const renderizarDatos = () => {
    if (respuesta.length === 0) {
      return <Text>Cargando...</Text>; // mensaje de carga mientras se espera la respuesta
    }

    return respuesta.map((elemento, index) => (
      <View key={index} style={styles.card}>
        <Text>Código: {elemento.codigo}</Text>
        <Text>Precio por día: {elemento.precioDia}</Text>
        {elemento.imagen && (
          <Image source={{ uri: elemento.imagen }} style={styles.image} />
        )}
        <Text>Modelos: {elemento.modelos}</Text>
        <Text>Marca: {elemento.marca}</Text>
        <Text>Descripción: {elemento.descripcion}</Text>
        <Text>Año: {elemento.anio}</Text>
        <Text>Capacidad: {elemento.capacidad}</Text>
        <Text>Categoría: {elemento.categoria}</Text>
        <Text>Límite: {elemento.limite}</Text>
      </View>
    ));
  };

  return <View style={styles.container}>{renderizarDatos()}</View>; // renderizar datos directamente
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});

export default Detail;
