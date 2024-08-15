import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const CandlestickChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCandlestickData = async () => {
      try {
        const response = await axios.get(
          'https://api.binance.com/api/v3/klines', {
            params: {
              symbol: 'BTCUSDT',
              interval: '15m',
              limit: 100
            }
          }
        );
        const chartData = processData(response.data);
        setData(chartData);
      } catch (error) {
        console.error('Error fetching data from Binance API:', error);
      }
    };

    fetchCandlestickData();
  }, []);

  const processData = (rawData) => {
    return rawData.map(d => ({
      x: new Date(d[0]),
      o: parseFloat(d[1]),
      h: parseFloat(d[2]),
      l: parseFloat(d[3]),
      c: parseFloat(d[4]),
    }));
  };

  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <LineChart
          data={{
            labels: data.map(d => d.x.toLocaleString()),
            datasets: [{ data: data.map(d => d.c) }]
          }}
          width={screenWidth - 32} // Ajusta para a largura da tela com margens
          height={220}
          chartConfig={{
            backgroundColor: "#000000", // Fundo preto
            backgroundGradientFrom: "#000000", // Gradiente de fundo inicial preto
            backgroundGradientTo: "#333333", // Gradiente de fundo final cinza escuro
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Linhas e textos brancos
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Cores das labels em branco
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffffff"
            },
          }}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Fundo preto para todo o container
    padding: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  }
});

export default CandlestickChart;
