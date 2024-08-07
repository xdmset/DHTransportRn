import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiURL } from '../api/apiGlobal';


const HomeScreen = () => {
    const [containers, setContainers] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchContainers = async () => {
            try {
                const url = apiURL + "/api/container";
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

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detail', { containerId: item.id })}
        >
            <Text style={styles.title}>Container ID: {item.id}</Text>
            <Text>Usable Capacity: {item.usableCapacity.toFixed(2)} m³</Text>
            <Text>Capacity per Meter: {item.capacityPerMeter.toFixed(2)} m³/m</Text>
            <Text>Total Capacity: {item.totalCapacity.toFixed(2)} m³</Text>
            <Text>Price: ${item.price.toFixed(2)}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Catalogo de contenedores</Text>
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
    card: {
        backgroundColor: '#F8F8F8',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default HomeScreen;

