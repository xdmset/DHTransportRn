import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider';
import { apiURL } from '../api/apiGlobal';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const { login } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = apiURL + "/api/user";
        const response = await fetch(url);
        console.log(url)
        if (!response.ok) {
          throw new Error(response.status);
        }
        const json = await response.json();
        setUsers(json.users);
        console.log(json);
      } catch (error) {
        console.error('Error al cargar usuarios: ', error);
      }
    };
    fetchData();
  }, []);

  const handleLogin = async () => {
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
      console.log("Inicio de sesión exitoso");
      await login(user.email, user.name, user.lastName, user.id);
      navigation.navigate('Main');
    } else {
      console.log('Nombre de usuario o contraseña incorrectos.');
    }
  };

  
  const handleRegister = async () => {
      navigation.navigate('AddUser');
  }


  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View style={styles.svgContainer}>
        <Svg width="100%" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M50 0L61.8034 15H38.1966L50 0Z" fill="#F8F8F8" />
        </Svg>
      </View>
      <View style={styles.loginContainer}>
        <Image
          source={{ uri: 'https://drive.google.com/uc?export=view&id=1c0toBHWuEMGhASw-fspaFQ9NETTfI2cl' }}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Welcome to DHTransport</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
        <View style={styles.containerRegister}>
          <Text style={styles.text}>Eres nuevo?</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.textAddUser}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  userSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  svgContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  loginContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#1191D4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#000000',
    fontSize: 18,
  },
  emailText: {
    marginTop: 20,
    color: 'grey',
  },
  textAddUser: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
    textDecorationLine: 'underline',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  containerRegister: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default LoginScreen;
