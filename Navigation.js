import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Importa tus componentes de pantalla
import LoginScreen from './screens/LoginScreen'; 
import HomeScreen from "./screens/HomeScreen";
import SettingScreen from "./screens/SettingScreen";
import StackScreen from './screens/StackScreen'; 
import AddNewUser from './screens/AddNewUser'
import Historial from './components/HIstorial';

import ShoppingCartScreen from './screens/ShoppingCartScreen';
import MonitorScreen from './screens/MonitorScreen';

import Detail from './screens/Detail';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Navegación de pila para la pestaña Home
function MyStack() {
    return (
        <Stack.Navigator initialRouteName='HomeScreen'>
            <Stack.Screen name='Catalogo' component={HomeScreen} />
            <Stack.Screen name='StackScreen' component={StackScreen} />
           
        </Stack.Navigator>
    );
}

// Navegación de pestañas con Ionicons
function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }else if (route.name === 'Cart') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    }else if (route.name === 'Monitoring') {
                        iconName = focused ? 'analytics' : 'analytics-outline';
                    }
                    
                    // Return the icon component
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#000000',
                tabBarInactiveTintColor: '#000000',
                tabBarStyle: {
                    backgroundColor: '#F3F2EB', // Color de fondo 
                },
            })}
        >
            {/* Pestaña de Inicio */}
            <Tab.Screen 
                name="Home" 
                component={MyStack}
                options={{ tabBarLabel: "Inicio", headerShown: false }}
            />
            <Tab.Screen 
                name="Cart" 
                component={ShoppingCartScreen}
                options={{ tabBarLabel: "Cart" }}
            />
            <Tab.Screen 
                name="Monitoring" 
                component={MonitorScreen}
                options={{ tabBarLabel: "Monitor" }}
            />
            <Tab.Screen 
                name="Settings" 
                component={SettingScreen}
                options={{ tabBarLabel: "Configuración" }}
            />
             
        </Tab.Navigator>
    );
}
  
// Contenedor principal de navegación
export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Main" component={MyTabs} />
                <Stack.Screen name="Detail" component={Detail} />
                <Stack.Screen name="AddUser" component={AddNewUser} />
                <Stack.Screen name="Historial" component={Historial}/>
                <Stack.Screen name="Cart" component={ShoppingCartScreen}/>
                <Stack.Screen name="Monitoring" component={MonitorScreen}/>

            </Stack.Navigator>
        </NavigationContainer>
    );
}
