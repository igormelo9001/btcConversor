import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import Icon from 'react-native-vector-icons/Ionicons'; // Ícone de seta para voltar

const SYMBOL = "BTCUSDT";
const QUANTITY = 0.001;
const TESTNET_API_URL = "https://testnet.binance.vision";
const MAINNET_API_URL = "https://api.binance.com";

// Chaves da Testnet
const TESTNET_API_KEY = "fCOiIKNzWF4YOeLA0FEqhkohKgQ4dAsMfztSpDZ9GBnGIbCFybBH7rmk2llhJIGX";
const TESTNET_SECRET_KEY = "La5la0DNSqRWRF14OA95Fj4OYXbZp12U3V539Apil6Ps7eu2Ldby5Jzg6Gaxqyiy";

let intervalId;

export default function App() {
  const navigation = useNavigation(); // Hook para navegação
  const [isRunning, setIsRunning] = useState(false);
  const [price, setPrice] = useState(null);
  const [sma, setSma] = useState(null);
  const [isOpened, setIsOpened] = useState(false);
  const [balance, setBalance] = useState(0);
  const [apiKey, setApiKey] = useState(TESTNET_API_KEY); // Padrão para Testnet
  const [secretKey, setSecretKey] = useState(TESTNET_SECRET_KEY); // Padrão para Testnet
  const [apiUrl, setApiUrl] = useState(TESTNET_API_URL); // Padrão para Testnet
  const [isModalVisible, setIsModalVisible] = useState(false);

  const calcSMA = (data) => {
    const closes = data.map(candle => parseFloat(candle[4]));
    const sum = closes.reduce((a, b) => a + b);
    return sum / data.length;
  };

  const startTrading = async () => {
    const { data } = await axios.get(`${apiUrl}/api/v3/klines?limit=21&interval=15m&symbol=${SYMBOL}`);
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
        `${apiUrl}/api/v3/order`,
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
    if (isRunning) {
      clearInterval(intervalId);
    } else {
      intervalId = setInterval(startTrading, 3000);
    }
    setIsRunning(!isRunning);
  };

  const handleRealAccount = () => {
    setIsModalVisible(true);
  };

  const handleConfirmRealAccount = () => {
    if (apiKey === '' || secretKey === '') {
      Alert.alert('Erro', 'Por favor, insira sua API Key e Secret Key.');
      return;
    }
    setApiUrl(MAINNET_API_URL); // Mudar para a URL da API de produção
    setIsModalVisible(false);
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

      <Text style={styles.label}>Preço Atual: {price ? `$${price}` : '---'}</Text>
      <Text style={styles.label}>SMA: {sma ? `$${sma}` : '---'}</Text>
      <Text style={styles.label}>Saldo: {balance ? `$${balance.toFixed(2)}` : '---'}</Text>

      <TouchableOpacity style={styles.button} onPress={toggleTrading}>
        <Text style={styles.buttonText}>{isRunning ? "Parar" : "Iniciar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.realAccountButton} onPress={handleRealAccount}>
        <Text style={styles.realAccountButtonText}>Conta Real</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalView}>
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

          <TouchableOpacity style={styles.modalButton} onPress={handleConfirmRealAccount}>
            <Text style={styles.modalButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  realAccountButton: {
    width: '80%',
    padding: 15,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#FF4500', // Vermelho laranja para diferenciar
    borderRadius: 10,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  realAccountButtonText: {
    color: '#FF4500', // Vermelho laranja
    fontSize: 18,
  },
  modalView: {
    marginTop: '50%',
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    fontSize: 16,
  },
  modalButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFA500',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
