import * as React from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-paper';

const MyAvatar = () => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
      <Avatar.Image 
        size={48} // Ajusta el tamaño según necesites
        source={require('../assets/images/icons/avatar.png')} 
        style={{ marginRight: 8 }} // Añade un pequeño espacio entre el avatar y el nombre
      />
      <Text>juan</Text> {/* Muestra el nombre al lado del avatar */}
    </View>
  );
};

export default MyAvatar;
