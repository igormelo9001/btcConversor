import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { BitcoinService } from '../services';

const WithdrawScreen = () => {
  const [receiverAddress, setReceiverAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleWithdraw = async () => {
    // Lógica para realizar saque
    try {
      const userWallet = /* Obtenha a chave privada da carteira do usuário */;
      await BitcoinService.sendBitcoin(userWallet.privateKey, receiverAddress, amount);
      // Exiba uma mensagem de sucesso
    } catch (error) {
      // Trate os erros adequadamente
    }
  };

  return (
    <View>
      <Text>Endereço do destinatário:</Text>
      <TextInput
        onChangeText={setReceiverAddress}
        value={receiverAddress}
        placeholder="Endereço do destinatário"
      />
      <Text>Quantidade:</Text>
      <TextInput
        onChangeText={setAmount}
        value={amount}
        placeholder="Quantidade em BTC"
      />
      <Button title="Sacar" onPress={handleWithdraw} />
    </View>
  );
};

export default WithdrawScreen;
