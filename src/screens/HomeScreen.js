import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import WalletAddress from '../components/WalletAddress';
import TransactionList from '../components/TransactionList';
import { BitcoinService } from '../services';

const HomeScreen = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Carregar endereço da carteira e transações
    const fetchWalletData = async () => {
      const address = await BitcoinService.getWalletAddress();
      const txs = await BitcoinService.getTransactions();
      setWalletAddress(address);
      setTransactions(txs);
    };
    fetchWalletData();
  }, []);

  return (
    <View>
      <WalletAddress address={walletAddress} />
      <TransactionList transactions={transactions} />
    </View>
  );
};

export default HomeScreen;
