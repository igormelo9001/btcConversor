import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WalletAddress = ({ address }) => {
  return (
    <Text style={styles.text}>
      Endereço da Carteira: {address}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#F7931A', // Bitcoin orange color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WalletAddress; 
