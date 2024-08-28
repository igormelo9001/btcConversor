import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, StyleSheet, ScrollView } from 'react-native';
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
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // Estado do modal de informações

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

    const signature = CryptoJS.HmacSHA256(new URLSearchParams(order).toString(), secretKey).toString();

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

  const verifyKeys = async () => {
    try {
      const response = await axios.get(`${MAINNET_API_URL}/api/v3/account`, {
        headers: { "X-MBX-APIKEY": apiKey }
      });
      if (response.status === 200) {
        setApiUrl(MAINNET_API_URL); // Se a resposta for válida, usar a URL da API de produção
        setIsModalVisible(false);
        Alert.alert('Sucesso', 'Chaves válidas! Usando conta real.');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        Alert.alert('Erro', 'As chaves fornecidas são inválidas para a conta real. Verifique as chaves e tente novamente.');
      } else {
        Alert.alert('Erro', 'Não foi possível verificar as chaves. Verifique a conexão e tente novamente.');
      }
    }
  };

  const handleConfirmRealAccount = () => {
    if (apiKey === '' || secretKey === '') {
      Alert.alert('Erro', 'Por favor, insira sua API Key e Secret Key.');
      return;
    }
    verifyKeys(); // Verifica se as chaves fornecidas são válidas para a conta real
  };

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, []);

  const handleGoBack = () => {
    navigation.replace('Conversor');
  }

  const handleInfoModal = () => {
    setIsInfoModalVisible(true); // Abre o modal de informações
  };

  const closeModal = () => {
    setIsInfoModalVisible(false);
  };

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

      <TouchableOpacity style={styles.infoButton} onPress={handleInfoModal}>
        <Text style={styles.infoButtonText}>Como Ativar Bot</Text>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isInfoModalVisible}
        onRequestClose={() => setIsInfoModalVisible(false)}
      >
        <View style={styles.infoModalView}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.infoText}>Para ativar o bot, siga os seguintes passos:</Text>
            <Text style={styles.infoText}>1. Acesse sua conta na Binance.</Text>
            <Text style={styles.infoText}>2. Navegue até o menu "Gerenciamento de API" em "Segurança".</Text>
            <Text style={styles.infoText}>3. Crie uma nova chave de API nomeando-a conforme sua preferência.</Text>
            <Text style={styles.infoText}>4. Após criar, copie a API Key e Secret Key.</Text>
            <Text style={styles.infoText}>5. Volte ao app e cole as chaves no modal da "Conta Real".</Text>
            <Text style={styles.infoText}>6. Certifique-se de que a chave tem permissão de "Trading".</Text>
            <Text style={styles.infoText}>7. Pressione "Confirmar" para verificar as chaves.</Text>
          </ScrollView>

          <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
            <Text style={styles.modalButtonText}>Fechar</Text>
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
    backgroundColor: '#333',
  },
  header: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  realAccountButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  realAccountButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  input: {
    width: '80%',
    backgroundColor: '#555',
    padding: 15,
    borderRadius: 5,
    color: '#fff',
    marginBottom: 20,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  modalButton: {
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  infoButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  infoModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  chartButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
});
