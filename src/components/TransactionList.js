import React from 'react';
import { FlatList, Text } from 'react-native';

const TransactionList = ({ transactions }) => {
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Text>{item.amount} BTC enviado para {item.receiver}</Text>
      )}
    />
  );
};

export default TransactionList;
