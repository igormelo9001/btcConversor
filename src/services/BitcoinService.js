import { Crypto } from 'expo';

class BitcoinService {
  static async getWalletAddress() {
    // Lógica para gerar ou obter endereço da carteira
    const wallet = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString()
    );
    return wallet;
  }

  static async getTransactions() {
    // Lógica para buscar transações da carteira
    return [
      { id: '1', amount: 0.1, receiver: 'Endereço1' },
      { id: '2', amount: 0.05, receiver: 'Endereço2' },
      // Mais transações...
    ];
  }
}

export default BitcoinService;
