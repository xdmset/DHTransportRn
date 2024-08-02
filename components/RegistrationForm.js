import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

import { apiURL } from '../api/apiGlobal';

const Formulario = ({ navigation }) => {

  const _apiURL = `${apiURL}/loginExample/registerUser.php`; 

  const [nombre, setNombre] = useState('');
  const [apPat, setApPat] = useState('');
  const [apMat, setApMat] = useState('');
  const [numTel, setNumTel] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validarCampos = () => {
    let isValid = true;
    let newErrors = {};

    if (!nombre) {
      newErrors.nombre = 'El nombre es obligatorio';
      isValid = false;
    }
    if (!apPat) {
      newErrors.apPat = 'El apellido paterno es obligatorio';
      isValid = false;
    }
    if (!apMat) {
      newErrors.apMat = 'El apellido materno es obligatorio';
      isValid = false;
    }
    if (!numTel) {
      newErrors.numTel = 'El número de teléfono es obligatorio';
      isValid = false;
    } else if (numTel.length !== 10) {
      newErrors.numTel = 'El número de teléfono debe tener 10 dígitos';
      isValid = false;
    }
    if (!usuario) {
      newErrors.usuario = 'La usuario es obligatorio';
      isValid = false;
    }
    if (!email) {
      newErrors.email = 'La email es obligatorio';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'La constrasena es obligatoria';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleTextChange = (text, type) => {
    if (/^[a-zA-Z\s]*$/.test(text)) {
      switch (type) {
        case 'nombre':
          setNombre(text);
          break;
        case 'apPat':
          setApPat(text);
          break;
        case 'apMat':
          setApMat(text);
          break;
        default:
          break;
      }
      setErrors(prev => ({...prev, [type]: ''}));
    }
  };

  const handleNumTelChange = (text) => {
    if (/^\d{0,10}$/.test(text)) {
      setNumTel(text);
      setErrors(prev => ({...prev, numTel: ''}));
    }
  };


  const enviarDatos = () => {
    if (!validarCampos()) return;

    axios.post(_apiURL, {
      nombreDeUsuario: usuario, 
      correoElectronico: email, 
      password: password, 
      nombre: nombre, 
      apellidoPaterno: apPat, 
      apellidoMaterno: apMat, 
      numeroDeTelefono: numTel, 
      
    })
    .then(() => {
      Alert.alert("Se ha realizado con éxito tu registro");
      

      // Reinicia tus campos aquí pendiente************************************************
    })
    .catch(() => {
      Alert.alert("Error", "Hubo un error al realizar tu registro");
    });
};

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}> 
        <Text style={styles.headerText}>Datos Personales</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleTextChange(text, 'nombre')}
          value={nombre}
          placeholder="Nombre"
        />
        {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

        <TextInput
          style={styles.input}
          onChangeText={(text) => handleTextChange(text, 'apPat')}
          value={apPat}
          placeholder="Apellido Paterno"
        />
        {errors.apPat && <Text style={styles.errorText}>{errors.apPat}</Text>}

        <TextInput
          style={styles.input}
          onChangeText={(text) => handleTextChange(text, 'apMat')}
          value={apMat}
          placeholder="Apellido Materno"
        />
        {errors.apMat && <Text style={styles.errorText}>{errors.apMat}</Text>}

        <TextInput
          style={styles.input}
          onChangeText={handleNumTelChange}
          value={numTel}
          placeholder="Numero de Telefono"
        />
        {errors.numTel && <Text style={styles.errorText}>{errors.numTel}</Text>}
        <Text style={styles.headerText}>Usuario</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setUsuario(text)}
          value={usuario}
          placeholder="Usuario"
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Correo Electronico"
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Contrasena"
        />
        
        <TouchableOpacity
          onPress={enviarDatos}
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
      //alignItems: 'center',

  },
  userSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  svgContainer: {
      alignItems: 'center',
      marginTop: 50,
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
  Button: {
      width: '80%',
      height: 50,
      backgroundColor: '#FFCD11',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 25,
  },
  ButtonText: {
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
      color: '#333',
      color: 'blue',
      textDecorationLine: 'underline',
  },
  text: {
      fontSize: 18,
      //fontWeight: 'bold',
      color: '#333',
  },
  containerRegister: {
      padding: 20,
      alignItems: 'center',

  },
  
  headerText: {
    fontSize: 30, 
    fontWeight: 'bold', 
    marginBottom: 10, 
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  }
});

export default Formulario;
