import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { apiURL } from '../api/apiGlobal';

const Formulario = ({ navigation }) => {
  const url = apiURL + "/api/user'";
  const _apiURL = url; // URL 

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('male'); // Default value
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let isValid = true;
    let newErrors = {};

    if (!name) {
      newErrors.name = 'El nombre es obligatorio';
      isValid = false;
    }
    if (!lastName) {
      newErrors.lastName = 'El apellido paterno es obligatorio';
      isValid = false;
    }
    if (!middleName) {
      newErrors.middleName = 'El apellido materno es obligatorio';
      isValid = false;
    }
    if (!phone) {
      newErrors.phone = 'El número de teléfono es obligatorio';
      isValid = false;
    } else if (phone.length !== 10) {
      newErrors.phone = 'El número de teléfono debe tener 10 dígitos';
      isValid = false;
    }
    if (!email) {
      newErrors.email = 'El correo electrónico es obligatorio';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleTextChange = (text, type) => {
    if (/^[a-zA-Z\s]*$/.test(text)) {
      switch (type) {
        case 'name':
          setName(text);
          break;
        case 'lastName':
          setLastName(text);
          break;
        case 'middleName':
          setMiddleName(text);
          break;
        default:
          break;
      }
      setErrors(prev => ({ ...prev, [type]: '' }));
    }
  };

  const handlePhoneChange = (text) => {
    if (/^\d{0,10}$/.test(text)) {
      setPhone(text);
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const sendData = async () => {
    if (!validateFields()) return;

    try {
      // Obtener todos los usuarios
      const response = await axios.get(_apiURL);
      console.log('Respuesta de la API:', response.data);

      const users = response.data.users;
      if (!Array.isArray(users)) {
        throw new Error('El formato de la respuesta de la API no es una lista de usuarios');
      }

      // Encontrar el ID más alto
      const highestId = users.reduce((max, user) => (user.id > max ? user.id : max), 0);
      console.log('El ID más alto es:', highestId);
      const nextId = highestId + 1;

    
      await axios.post(_apiURL, {
        Id: nextId,
        FirstName: name, 
        LastName: lastName, 
        MiddleName: middleName, 
        Phone: phone, 
        Email: email, 
        Password: password, 
        Gender: gender, 
        Role: 'Customer' // Default value
      });

      Alert.alert("Registro exitoso", "Se ha realizado con éxito tu registro");

      // Clear fields after successful registration
      setName('');
      setLastName('');
      setMiddleName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setGender('male');
    } catch (error) {
      console.error('Error al realizar el registro:', error);
      Alert.alert("Error", "Hubo un error al realizar tu registro");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}> 
        <Text style={styles.headerText}>Datos Personales</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleTextChange(text, 'name')}
          value={name}
          placeholder="Nombre"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <TextInput
          style={styles.input}
          onChangeText={(text) => handleTextChange(text, 'lastName')}
          value={lastName}
          placeholder="Apellido Paterno"
        />
        {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

        <TextInput
          style={styles.input}
          onChangeText={(text) => handleTextChange(text, 'middleName')}
          value={middleName}
          placeholder="Apellido Materno"
        />
        {errors.middleName && <Text style={styles.errorText}>{errors.middleName}</Text>}

        <TextInput
          style={styles.input}
          onChangeText={handlePhoneChange}
          value={phone}
          placeholder="Número de Teléfono"
          keyboardType="numeric"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        <Text style={styles.headerText}>Género</Text>
        <Picker
          selectedValue={gender}
          style={styles.picker}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Masculino" value="male" />
          <Picker.Item label="Femenino" value="female" />
        </Picker>

        <Text style={styles.headerText}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Correo Electrónico"
          keyboardType="email-address"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <Text style={styles.headerText}>Contraseña</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Contraseña"
          secureTextEntry
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        
        <TouchableOpacity
          onPress={sendData}
          style={styles.Button}
        >
          <Text style={styles.ButtonText}>
            Realizar registro
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  container: {
    marginTop: 90,
    alignItems: 'center',
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
  picker: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 20,
  },
  Button: {
    width: '80%',
    height: 50,
    backgroundColor: '#1191D4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  ButtonText: {
    color: '#000000',
    fontSize: 18,
  },
  headerText: {
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10, 
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  }
});

export default Formulario;
