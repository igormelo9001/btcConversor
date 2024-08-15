import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import Icon from 'react-native-vector-icons/Ionicons'; // Ícone de seta para voltar


const SYMBOL = "BTCUSDT";
const QUANTITY = 0.001;
const API_URL = "https://testnet.binance.vision";//https://api.binance.com";

let intervalId;

export default function App() {
  const navigation = useNavigation(); // Hook para navegação
  const [isRunning, setIsRunning] = useState(false);
  const [price, setPrice] = useState(null);
  const [sma, setSma] = useState(null);
  const [isOpened, setIsOpened] = useState(false);
  const [balance, setBalance] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const calcSMA = (data) => {
    const closes = data.map(candle => parseFloat(candle[4]));
    const sum = closes.reduce((a, b) => a + b);
    return sum / data.length;
  };

  const startTrading = async () => {
    const { data } = await axios.get(`${API_URL}/api/v3/klines?limit=21&interval=15m&symbol=${SYMBOL}`);
    const candle = data[data.length - 1];
    const currentPrice = parseFloat(candle[4]);
    setPrice(currentPrice);

    const calculatedSma = calcSMA(data);
    setSma(calculatedSma);

    if (currentPrice < (calculatedSma * 0.9) && !isOpened) {
      setIsOpened(true);
      newOrder(SYMBOL, QUANTITY, "BUY");
      setBalance(balance + (QUANTITY * currentPrice)); // Simulando alteração de saldo
    } else if (currentPrice > (calculatedSma * 1.1) && isOpened) {
      newOrder(SYMBOL, QUANTITY, "SELL");
      setIsOpened(false);
      setBalance(balance - (QUANTITY * currentPrice)); // Simulando alteração de saldo
    }
  };

  const newOrder = async (symbol, quantity, side) => {
    const order = { symbol, quantity, side, type: "MARKET", timestamp: Date.now() };

    const signature = CryptoJS.HmacSHA256(new URLSearchParams(order).toString(), secretKey).toString(); // Substituindo por crypto-js

    order.signature = signature;

    try {
      const { data } = await axios.post(
        `${API_URL}/api/v3/order`,
        new URLSearchParams(order).toString(),
        {
          headers: { "X-MBX-APIKEY": apiKey }
        }
      );
      console.log(data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const toggleTrading = () => {
    if (apiKey === '' || secretKey === '') {
      Alert.alert('Erro', 'Por favor, insira sua API Key e Secret Key.');
      return;
    }

    if (isRunning) {
      clearInterval(intervalId);
    } else {
      intervalId = setInterval(startTrading, 3000);
    }
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, []);

  const handleGoBack = () => {
    navigation.replace('Conversor');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.chartButton} onPress={() => navigation.navigate('CandlestickChart')}>
        <Icon name="trending-up" size={24} color="#fff" />
      </TouchableOpacity>
      
      <Text style={styles.header}>BotCrypto</Text>
      
      <TextInput
        style={styles.input}
        placeholder="API Key"
        placeholderTextColor="#888"
        value={apiKey}
        onChangeText={setApiKey}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Secret Key"
        placeholderTextColor="#888"
        secureTextEntry={true}
        value={secretKey}
        onChangeText={setSecretKey}
      />

      <Text style={styles.label}>Preço Atual: {price ? `$${price}` : '---'}</Text>
      <Text style={styles.label}>SMA: {sma ? `$${sma}` : '---'}</Text>
      <Text style={styles.label}>Saldo: {balance ? `$${balance.toFixed(2)}` : '---'}</Text>

      <TouchableOpacity style={styles.button} onPress={toggleTrading}>
        <Text style={styles.buttonText}>{isRunning ? "Parar" : "Iniciar"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
  },
  chartButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
  },
  header: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    color: '#fff',
    backgroundColor: '#333',
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 5,
  },
  button: {
    width: '80%',
    padding: 15,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#FFA500', // Laranja
    borderRadius: 10, // Arredondamento das bordas
    backgroundColor: '#000', // Preto
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFA500', // Laranja
    fontSize: 18,
  },
});

