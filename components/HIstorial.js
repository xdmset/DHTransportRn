import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../components/AuthProvider';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { apiURL } from '../api/apiGlobal';

const Historial = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWrong, setIsWrong] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rentalUrl = apiURL + "/api/rental";
        const clientUrl = apiURL + "/api/client";
        
        // Fetch rental data
        const rentalResponse = await fetch(rentalUrl);
        if (!rentalResponse.ok) {
          throw new Error(`Network response was not ok: ${rentalResponse.statusText}`);
        }
        const rentalResult = await rentalResponse.json();
        
        // Fetch client data
        const clientResponse = await fetch(clientUrl);
        if (!clientResponse.ok) {
          throw new Error(`Network response was not ok: ${clientResponse.statusText}`);
        }
        const clientResult = await clientResponse.json();
        
        // Find clientId corresponding to the logged-in user
        const clientData = clientResult.client.find(c => c.user[0].id === user.id);
        const clientId = clientData ? clientData.clientId : null;
        
        if (clientId && Array.isArray(rentalResult.rental)) {
          const userRentals = rentalResult.rental.filter(rental => rental.clientId[0].clientId === clientId);
          setData(userRentals);
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
  }, [user.id]);

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

  const printData = () => {
    if (isWrong) {
      return <Text style={styles.errorText}>Hubo un error al cargar los datos.</Text>;
    }

    if (data.length === 0) {
      return <Text style={styles.errorText}>No se encontraron resultados.</Text>;
    }

    return data.map((item, index) => {
      const userInfo = getUserInfo(item.clientId[0]);
      const formattedStartDate = format(new Date(item.startDate), 'dd MMMM yyyy HH:mm', { locale: es });
      const formattedEndDate = format(new Date(item.endDate), 'dd MMMM yyyy HH:mm', { locale: es });

      return (
        <View key={index} style={styles.card}>
          <Text style={styles.cardText}>Usuario: {userInfo.name}</Text>
          <Text style={styles.cardText}>ID de Renta: {item.rentalId}</Text>
          <Text style={styles.cardText}>Fecha de Inicio: {formattedStartDate}</Text>
          <Text style={styles.cardText}>Fecha de Finalización: {formattedEndDate}</Text>
          <Text style={styles.cardText}>Subtotal: ${item.subtotal.toFixed(2)}</Text>
          <Text style={styles.cardText}>IVA: ${item.vat.toFixed(2)}</Text>
          <Text style={styles.cardText}>Total: ${item.total.toFixed(2)}</Text>
        </View>
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Historial de Rentas</Text>
      </View>
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
  header: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
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

export default Historial;
