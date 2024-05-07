import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { BitcoinService } from '../services'; 


const DepositScreen = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [amount, setAmount] = useState('');

    const handleSend = async () => {
        try {
            const result = await bitcoinService.sendBitcoin(walletAddress, amount);
            console.log('Bitcoin sent:', result);
            // Add any additional logic or UI updates here
        } catch (error) {
            console.error('Error sending bitcoin:', error);
            // Handle error and display appropriate message to the user
        }
    };

    return (
        <View style={{ backgroundColor: '#F7931A', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#FFFFFF', marginBottom: 20 }}>Endereço da sua carteira para depósito:</Text>
            <Text style={{ color: '#FFFFFF', marginBottom: 20 }}>{walletAddress}</Text>
            <TextInput
                placeholder="Endereço da carteira"
                value={walletAddress}
                onChangeText={setWalletAddress}
                style={{ backgroundColor: '#FFFFFF', marginBottom: 20 }}
            />
            <TextInput
                placeholder="Quantidade de bitcoin"
                value={amount}
                onChangeText={setAmount}
                style={{ backgroundColor: '#FFFFFF', marginBottom: 20 }}
            />
            <TouchableOpacity onPress={handleSend} style={{ backgroundColor: '#FFB900', padding: 10 }}>
                <Text style={{ color: '#FFFFFF' }}>Enviar</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DepositScreen;