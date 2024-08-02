import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StackScreen = () => {
  return (
    <View>
      <Text style={styles.text}>
        StackScreen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: '20%',
  },
});

export default StackScreen;
