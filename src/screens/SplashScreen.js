
import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const SplashScreen = () => {

   const navigation = useNavigation();

  useEffect(() => {
    // Navega para a tela principal após 3 segundosd
    const timer = setTimeout(() => {
      navigation.replace('Conversor');
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/bitcoin.jpg')}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7931a', // Laranja do Bitcoin
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
