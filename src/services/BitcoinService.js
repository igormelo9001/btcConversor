const bitcoin = require('bitcoinjs-lib');
const bitcoinCore = require('bitcoin-core');
const axios = require('axios');

const network = bitcoin.networks.testnet; // Use testnet for development, change to 'bitcoin.networks.bitcoin' for mainnet

// Function to generate a secure private key
function generatePrivateKey() {
    return bitcoin.ECPair.makeRandom().toWIF();
}

// Function to get the public key from a private key
function getPublicKeyFromPrivateKey(privateKey) {
    const privateKeyBuffer = bitcoin.ECPair.fromWIF(privateKey).privateKey;
    const publicKeyBuffer = bitcoin.ECPair.fromPrivateKey(privateKeyBuffer).publicKey;
    return publicKeyBuffer.toString('hex');
}

// Function to validate a Bitcoin address
function validateBitcoinAddress(address) {
    try {
        bitcoin.address.toOutputScript(address, network);
        return true;
    } catch (error) {
        console.error("Invalid Bitcoin address:", error);
        return false;
    }
}

// Function to list transactions associated with a wallet
async function getTransactions(walletAddress) {
    try {
        const response = await axios.get(`https://blockchain.info/rawaddr/${walletAddress}`);
        const transactions = response.data.txs;
        return transactions.map(tx => {
            return {
                hash: tx.hash,
                value: tx.value,
                date: new Date(tx.time * 1000) // Convert UNIX timestamp to JavaScript date
            };
        });
    } catch (error) {
        console.error("Error fetching wallet transactions:", error);
        throw error;
    }
}

// Function to validate the amount of bitcoins to be sent
function validateBitcoinAmount(amount) {
    if (isNaN(amount) || amount <= 0) {
        console.error("Invalid Bitcoin amount.");
        return false;
    }
    return true;
}

// Function to build a transaction
async function buildTransaction(userWallet, receiverAddress, amount) {
    try {
        // Check if user wallet has sufficient funds
        // (Implementation of this check depends on the wallet structure)
        
        const transactionBuilder = new bitcoin.TransactionBuilder(network);
        transactionBuilder.addInput(userWallet.utxo, userWallet.index);
        transactionBuilder.addOutput(receiverAddress, amount);
        return transactionBuilder.buildIncomplete();
    } catch (error) {
        console.error("Error building transaction:", error);
        throw error;
    }
}

// Function to sign a transaction
async function signTransaction(transaction, privateKey) {
    try {
        const keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'), { network });
        transaction.sign(0, keyPair);
        return transaction;
    } catch (error) {
        console.error("Error signing transaction:", error);
        throw error;
    }
}

// Function to transmit a transaction
async function transmitTransaction(signedTransaction) {
    try {
        const client = new bitcoinCore({ network: 'testnet' }); // Connect to a Bitcoin node on testnet, change to 'bitcoin' for mainnet
        const txid = await client.sendRawTransaction(signedTransaction.toHex());
        return txid;
    } catch (error) {
        console.error("Error transmitting transaction:", error);
        throw new Error("Error transmitting transaction: " + error.message);
    }
}

// Handler to send bitcoins
async function handleSendBitcoin(userWallet, receiverAddress, amount) {
    try {
        // Validate user inputs
        if (!validateBitcoinAddress(receiverAddress)) {
            throw new Error("Invalid Bitcoin address.");
        }
        if (!validateBitcoinAmount(amount)) {
            throw new Error("Invalid Bitcoin amount.");
        }

        // Build transaction
        const transaction = await buildTransaction(userWallet, receiverAddress, amount);
        
        // Sign transaction
        const signedTransaction = await signTransaction(transaction, userWallet.privateKey);
        
        // Transmit transaction
        const response = await transmitTransaction(signedTransaction);
        
        console.log("Transaction sent successfully:", response);

        // List wallet transactions
        const walletTransactions = await getTransactions(userWallet.address);
        console.log("Wallet transactions:", walletTransactions);
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}

// Exporting as BitcoinService
const BitcoinService = {
    generatePrivateKey,
    getPublicKeyFromPrivateKey,
    validateBitcoinAddress,
    getTransactions,
    handleSendBitcoin
};

module.exports = BitcoinService;
