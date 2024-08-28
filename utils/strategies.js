// utils/strategies.js

import axios from 'axios';

const API_URL = "https://testnet.binance.vision";
const SYMBOL = "BTCUSDT";
const QUANTITY = 0.001;

export const calcSMA = (data) => {
    const closes = data.map(candle => parseFloat(candle[4]));
    const sum = closes.reduce((a, b) => a + b);
    return sum / data.length;
};

export const calcEMA = (data, period = 10) => {
    const k = 2 / (period + 1);
    let emaArray = [];
    let ema = parseFloat(data[0][4]);

    data.forEach((candle) => {
        const close = parseFloat(candle[4]);
        ema = close * k + ema * (1 - k);
        emaArray.push(ema);
    });

    return emaArray[emaArray.length - 1];
};

export const calcMACD = (data) => {
    const ema12 = calcEMA(data, 12);
    const ema26 = calcEMA(data, 26);
    return ema12 - ema26;
};

export const calcBollingerBands = (data, period = 20) => {
    const closes = data.map(candle => parseFloat(candle[4]));
    const sma = calcSMA(data.slice(-period));
    const variance = closes.slice(-period).reduce((acc, price) => acc + Math.pow(price - sma, 2), 0) / period;
    const stdDeviation = Math.sqrt(variance);
    
    const upperBand = sma + (stdDeviation * 2);
    const lowerBand = sma - (stdDeviation * 2);
    
    return {
        upperBand,
        lowerBand,
        middleBand: sma
    };
};

export const calcRSI = (data, period = 14) => {
    const closes = data.map(candle => parseFloat(candle[4]));
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < period + 1; i++) {
        const difference = closes[i] - closes[i - 1];
        if (difference >= 0) {
            gains += difference;
        } else {
            losses -= difference;
        }
    }

    const averageGain = gains / period;
    const averageLoss = losses / period;
    const rs = averageGain / averageLoss;
    const rsi = 100 - (100 / (1 + rs));

    return rsi;
};

// Função que define a estratégia com base na string recebida
export const setStrategi = (strategy, data) => {
    let result;

    switch (strategy) {
        case 'SMA':
            result = calcSMA(data);
            break;
        case 'EMA':
            result = calcEMA(data);
            break;
        case 'MACD':
            result = calcMACD(data);
            break;
        case 'BollingerBands':
            result = calcBollingerBands(data);
            break;
        case 'RSI':
            result = calcRSI(data);
            break;
        default:
            console.error("Estratégia não reconhecida!");
            return;
    }

    console.log(`Resultado da estratégia ${strategy}:`, result);
    return result;
};
