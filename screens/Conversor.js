import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'https://api.coindesk.com/v1/bpi/currentprice/';

const App = () => {
  const [saldoBtc, setSaldoBtc] = useState('');
  const [saldoUsd, setSaldoUsd] = useState('');
  const [saldoBrl, setSaldoBrl] = useState('');
  const [btcToUsd, setBtcToUsd] = useState('');
  const [btcToBrl, setBtcToBrl] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuOptionSelect = (option) => {
    // Implemente a navegação para as telas correspondentes aqui
    console.log('Opção selecionada:', option);
  };

  const fetchBitcoinRate = async () => {
    try {
      const usdResponse = await axios.get(`${API_URL}USD.json`);
      const usdRate = usdResponse.data.bpi.USD.rate_float;

      const brlResponse = await axios.get(`${API_URL}BRL.json`);
      const brlRate = brlResponse.data.bpi.BRL.rate_float;

      if (saldoBtc !== '') {
        setBtcToUsd((parseFloat(saldoBtc) * usdRate).toFixed(2));
        setBtcToBrl((parseFloat(saldoBtc) * brlRate).toFixed(2));
      }

      if (saldoUsd !== '') {
        setSaldoBtc((parseFloat(saldoUsd) / usdRate).toFixed(8));
      }

      if (saldoBrl !== '') {
        setSaldoBtc((parseFloat(saldoBrl) / brlRate).toFixed(8));
      }

    } catch (error) {
      Alert.alert('Erro ao obter cotações', 'Tente novamente mais tarde.');
    }
  };

  const handleReset = () => {
    setSaldoBtc('');
    setSaldoUsd('');
    setSaldoBrl('');
    setBtcToUsd('');
    setBtcToBrl('');
  };

  return (
    <View style={styles.container}>
        <View style={styles.MenuContainer}>
        <TouchableOpacity style={styles.menuIcon} onPress={toggleMenu}>
          <Ionicons name={isMenuOpen ? 'close' : 'menu'} size={24} color="white" style={[styles.header, { top: 40, left: 20 }]} />
        </TouchableOpacity>
        {isMenuOpen && (
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOptionSelect('Carteira')}>
              <Text>Carteira</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOptionSelect('Cotações')}>
              <Text>Cotações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOptionSelect('Matérias')}>
              <Text>Matérias</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Digite o saldo em BTC"
        keyboardType="numeric"
        value={saldoBtc}
        onChangeText={setSaldoBtc}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite o saldo em USD"
        keyboardType="numeric"
        value={saldoUsd}
        onChangeText={setSaldoUsd}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite o saldo em BRL"
        keyboardType="numeric"
        value={saldoBrl}
        onChangeText={setSaldoBrl}
      />
      <TouchableOpacity style={styles.button} onPress={fetchBitcoinRate}>
        <Text style={styles.buttonText}>Converter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Resetar</Text>
      </TouchableOpacity>
      <Text style={styles.resultText}>
        <Text style={styles.resultLabelText}>BTC para USD:</Text> <Text style={styles.resultValueText}>{btcToUsd}</Text> | <Text style={styles.resultLabelText}>BTC para BRL:</Text> <Text style={styles.resultValueText}>{btcToBrl}</Text>
      </Text>
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
  input: {
    width: '80%',
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#f7931a',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
  },
  resultLabelText: {
    fontWeight: 'bold',
  },
  resultValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  MenuContainer: {
    flex: 0.5,
    backgroundColor: '#fff',
  },
  menuIcon: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 200,
    backgroundColor: '#f0f0f0',
    zIndex: 2,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
