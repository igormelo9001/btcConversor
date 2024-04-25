import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'https://api.coindesk.com/v1/bpi/currentprice/';

const App = () => {
  const [saldoBtc, setSaldoBtc] = useState('');
  const [saldoUsd, setSaldoUsd] = useState('');
  const [saldoBrl, setSaldoBrl] = useState('');
  const [btcToUsd, setBtcToUsd] = useState('');
  const [btcToBrl, setBtcToBrl] = useState('');

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
});

export default App;
