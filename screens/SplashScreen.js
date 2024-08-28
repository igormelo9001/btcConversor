import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; // Importando o LinearGradient do Expo

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Conversor');
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#f7931a', '#d87c08']} // Gradiente de laranja claro para escuro
      style={styles.container}
    >
      <Image
        source={require('../assets/bitcoin.jpg')}
        style={styles.logo}
      />
      <Text style={styles.text}>CryptoMaster</Text> 
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  text: {
    marginTop: 20,
    fontSize: 24,
    color: '#fff', // Branco para contraste com o fundo
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});

export default SplashScreen;
